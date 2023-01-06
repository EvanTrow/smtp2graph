# smtp2graph

Docker image for relaying mail from SMTP to the Microsoft Graph API. Uses node smtp-server and MS Graph sendMail.

## Deploy

```bash
docker run -d \
    -p 25:25 \
    -p 8080:8080 \
    -e CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -e CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
    -e TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -e DEV_MODE=false \
    -e WEB_SERVER=true \
    -e WEB_SERVER_MESSAGE_LIMIT=50 \
    --name=smtp2graph \
    evantrow/smtp2graph:latest
```

## Environment Variables

| Variable                 | What it do?                                     |
| ------------------------ | ----------------------------------------------- |
| CLIENT_ID                | Azure Application (client) ID                   |
| CLIENT_SECRET            | Azure Application Client Secret                 |
| TENANT_ID                | Directory (tenant) ID                           |
| DEV_MODE                 | Disables email relaying                         |
| WEB_SERVER               | Enables web server for capturing emails         |
| WEB_SERVER_MESSAGE_LIMIT | Limits the ammount of emails to store in memory |
