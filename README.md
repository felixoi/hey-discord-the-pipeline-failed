# Hey Discord, the pipeline failed!

Cloudflare Worker which can be used as a middleware between Gitlab webhooks and Discord webhooks to send out custom discord messages when your projects pipeline failed.

## Setup

1. Create a new Discord webhook in the desired notification channel and save the webhook
url as a new secret named `DISCORD_WEBHOOK`
2. Choose a secret which will allow Gitlab to access to the worker and save it
as a new secret named `GITLAB_WEBHOOK_SECRET_TOKEN`
3. Create a new KV store and change the `wrangler.toml` accordingly.
4. Create new KV pairs to configure the notifications (see configuration)
5. Create a new Gitlab webhook in the desired repository.
   1. URL: the deployment url of this worker
   2. Secret token: the chosen secret
   3. Trigger: disable all but `Pipeline events`
   4. SSL verification: true

## Configuration

The configuration takes advantage of Cloudflare's key value store
as each key in the configured kv store represents the notification configuration
for one specific repository.

key: `repository web url`   
value: `{"branch_name": "notification text", ...}`

for example:

key: `https://gitlab.com/example-group/example-project`   
value: `{"main": "<@&979396042485276733> Die Pipeline der Webseite für den main-Branch ist fehlgeschlagen!", ...}`
