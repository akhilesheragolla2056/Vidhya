# Classroom deployment settings

Classroom chat, shared notes, hand raises, and participant presence use Socket.IO. Set the production `VITE_API_URL` to the deployed API origin, including `/api` (for example, `https://api.example.com/api`). The client derives its Socket.IO address from that value unless `VITE_SOCKET_URL` is set explicitly.

For a single API instance, no shared socket store is needed. If the platform can run multiple API instances, provision a private Redis service and set the API's `REDIS_URL`; the server then enables the Socket.IO Redis adapter so room events and signaling reach users connected to different instances. If the load balancer allows HTTP long polling across instances, enable session affinity as well.

Camera and microphone use peer-to-peer WebRTC. The server includes a public STUN server by default. For reliable connections across restrictive school, office, and mobile networks, configure a TURN provider on the API with `TURN_URLS` (comma-separated). Coturn deployments can use `TURN_SECRET` to issue one-hour credentials per classroom user; providers with issued credentials can use `TURN_USERNAME` and `TURN_CREDENTIAL`. TURN details are sent only to authenticated classroom participants when they join the live socket room.

`REDIS_URL` and TURN values are also listed as unsynced production environment variables in `render.yaml`; add the values in the hosting dashboard. Keep Redis private to the API service.
