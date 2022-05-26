interface Environment {
  GITLAB_WEBHOOK_SECRET_TOKEN: string;
  DISCORD_WEBHOOK: string;
  CONFIG: KVNamespace;
}

const worker: ExportedHandler<Environment> = {
  async fetch(request: Request, env: Environment): Promise<Response> {
    if(request.method !== "POST") {
      return new Response("Nothing to see here. Use POST instead.", {status: 400});
    }

    if (!request.headers.has('X-Gitlab-Token')
        || request.headers.get('X-Gitlab-Token') !== env.GITLAB_WEBHOOK_SECRET_TOKEN) {
      return new Response("Access denied.", {status: 401});
    }

    if(!request.headers.has('X-Gitlab-Event') || request.headers.get('X-Gitlab-Event') !== 'Pipeline Hook') {
      return new Response("This service is only available for pipeline hooks.", {status: 400});
    }

    const data: PipelineHook = await request.json().catch(() => {
      return new Response("You need to send json data.", {status: 400});
    }) as PipelineHook;

    console.log(data.object_attributes.status)

    if(data.object_attributes.status !== "failed") return new Response("Yey! Pipeline did not fail! Nothing to do.");

    const entry: string | null = await env.CONFIG.get(data.project.web_url) as string;

    if(!entry) return new Response("No notification is configured for this repository.");

    let repoConfig: any;
    try {
      repoConfig = JSON.parse(entry);
    } catch (e) {
      return new Response("Invalid configuration for the given repository.", {status: 500});
    }

    if(!repoConfig[data.object_attributes.ref]) return new Response("No notification is configured for this branch.");

    await sendDiscordMessage(env.DISCORD_WEBHOOK, repoConfig[data.object_attributes.ref]).catch(() => {
      return new Response("Failed to send notification.", {status: 500});
    })

    return new Response("Notification for failed pipeline was sent.");
  },
};

async function sendDiscordMessage(webhook_url: string, message: string) {
  const init = {
    body: JSON.stringify({
      username: "Gitlab",
      avatar_url: "https://about.gitlab.com/images/press/logo/png/gitlab-logo-500.png",
      content: message
    }),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  };
  await fetch(webhook_url, init);
}

export default worker;
