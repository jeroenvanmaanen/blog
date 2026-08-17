# A new game for the internet

There are many ways to improve digital autonomy. Copying the Silicon Valley business model and promoting European big tech is one of them, but, in my opinion, deeply flawed. European big tech is likely to be just as bad for autonomy as big tech from the USA, because the necessity of compliance with European laws doesn't mean much if European governments become dependent of these companies and need to accommodate them because they are too big to fail. Also, European big tech works only for Europe, it doesn't improve the global tech game. Finally, European companies lag significantly behind companies from the USA. Matching them at their own game will be an extremely tall order.

A different way of improving digital autonomy would be to invent a new game with different rules. These rules could be chosen to strengthen qualities of the internet that used to be central to its original design. The name "Internet" is no coincidence. It is designed to be a network of interconnected networks. The whole idea of the 'cloud' that rains spam and slop on us is a more recent invention to make the internet more profitable for the big bro's. What if we built structures that let us use the internet as a way to connect, share and collaborate *on our own terms*, rather than being forced to accept the terms and conditions of one of the usual suspects?

Current app-stores sell apps that run in the cloud. You just rent them. The data is not really yours. It is possibly legally owned by you, but for access to that data, you are completely dependent on the company that runs the server-side of the app.

Enter local-first. Local-first apps are different. Local-first is a movement that proposes to support apps that run locally. A local-first app is not just the front-end for a cloud app, you get the *entire* app and it stores all data on your own device.

Now, we don't want to go back in time to when you needed to save to a floppy to share a document! Local-first is *not* local-only. Local-first apps package changes to the local data-store in messages called events. When online, these events are broadcast to devices that are subscribed to these events, even events that happened when the device was offline. Based on these events, other devices can reconstruct a copy of the data and keep it identical to the source while it changes. It is even possible to merge events from different devices in real-time and construct a merged data-store on these devices. That makes it possible to work together at the same time in the same document on the same document like in Google Docs or Microsoft365.

Of course, if every app-maker invents their own way to store and synchronize events, we would still be dependent on them for access to our data. On top of that, it is quite difficult to design the data-store, the event messages and the negotiation between devices in such a way that it all works reliably and efficiently. We need an open standard with a reference implementation that proves that it works. Luckily at least one candidate exists: the [Authenticated Transfer Protocol](https://atproto.com/), or *atproto* for short. Atproto can be combined with e.g. [automerge](https://automerge.org/) to function as a complete foundation for local-first apps.

Personally, I would like to be as self-sufficient as possible, but participating on the internet implies making use of shared infrastructure. The designers of atproto realized that trying to get devices that may not be online at the same time to synchronize is not possible without external help. Also, having countless devices connect directly to each other is quite inefficient. So they introduced a Personal Data Server ([PDS](https://atproto.com/guides/glossary#pds-personal-data-server)) to act as a proxy for your devices. Personal Data Servers of different individuals synchronize events using [Relays](https://atproto.com/guides/glossary#relay). Now, relays just make sure that data is shared as soon as possible. A relay is oblivious to the actual content of the events, it inspects just the information of each event that it needs to send it to its subscribers. Other information is likely to be encrypted with a key that is not shared with any public infrastructure.

A Personal Data Server, however, stores my personal data, hence the name. I want to be in control of that data, so I want to host it myself, in my own house. There is probably even data on it that I don't want to share with any relay; it shouldn't leave my house at all.

When events *do* leave the house, I need to sign them with an identity key to show they are authentic (that is what the **A** in **A**tproto stands for). There is no need to share the private key for this identity with anyone, not the government nor a notary nor a bank. When necessary, I can share the associated public key and prove that I have the private key and promise that I won't share the private key with anyone else on punishment of being stolen from or being held accountable for the actions of someone else. (As Han Solo said: "*hey, it's me*".) I can put the identity keys in my own key-vault that is encrypted with a very strong password. I can copy the encrypted key-vault to lots of places, so I can recover from the loss of any device. My keys, my rules.

There is some technical stuff that I think is missing at the moment. Most people will want to skip to the [non-technical next steps](#nontechnicalnextsteps), however.

## Technical stuff

When I looked at [the instructions to self-host a PDS](https://atproto.com/guides/self-hosting#pds), I quickly discovered that I need "Public inbound internet access permitted on port 80/tcp and 443/tcp". This means a signed certificate for the HTTPS-port (443). Now, I do own a home-server running [TrueNAS](https://www.truenas.com/docs/scale/) and I should be able to configure an [Actalis](https://www.actalis.com/) account (a European alternative to [Let's Encrypt](https://letsencrypt.org/)), but it is complicated, highly vendor specific, and, in my opinion, unnecessary.

Wouldn't it be lovely if a PDS could also listen for incoming [Iroh](https://www.iroh.computer/)-connections. Sign the public key of the Iroh-listener with the same identity key that is used to sign the data on this server to authenticate it and tell the atproto-relay to dial that public key when there are events it needs to process.

This would mean that there should be PDS software that can accept Iroh-connections and that there are atproto Relays that know how to dial them (including the validation of the signature on the public key with the signature on the subscriptions).

In that case self-hosting a PDS would be a simple as spinning up a container that has access to the identity keys and (optionally?) the addresses of non-standard iroh and/or atproto relays.

## Non-technical next steps

* Legislation to prevent monopolies by assuring that small competitors can participate in the market
    * Enforce open standards
    * Enforce [interoperability](https://berjon.com/interoperability/)
    * [Repeal anti-circumvention law](https://www.youtube.com/watch?v=3C1Gnxhfok0)
* Standardize [lexicons](https://atproto.com/guides/glossary#lexicon) for commodity data (like calendar event, contact, list item, document, Git repo, ...)
* Many infrastructure providers should provide an AT Protocol Relay and/or an Iroh relay; this ensures that apps remain interoperable at the infrastructure level, even if one company quits
* Mirror code that resides in big-tech cloud repositories to data-stores that can be shared with atproto (e.g., in [Tangled](https://tangled.org/)); this ensures that code can evolve, even if the creator or previous maintainers stop working on it
* Structural state and/or European funding for maintenance and compliancy checks of essential open-source software
