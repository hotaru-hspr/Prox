# Prox.
Prox. - The Social Media App that makes you touch grass!

Submission to the SNUC Delta Inductions - Round 2 (2023).

[Vercel site](https://prox-by-hotaru.vercel.app/)

# Guide
1. Install required Python modules specified in ```requirements.txt``` by running ```pip install -r requirements.txt``` in terminal cd'd at directory of file.

2. Open main.py file from the repo through terminal to initialize the server.

3. Once the server is up, you can access the above Vercel site with all functionality working. Note that viewing, creating and modifying posts will not work without the server running.

# Screenshots
<img width="1271" alt="login" src="https://github.com/hotaru-hspr/Prox/assets/145186759/42a9cd5a-f0f1-4f87-acc0-5d9a57b5ac68">
<img width="1259" alt="feed" src="https://github.com/hotaru-hspr/Prox/assets/145186759/57f8f889-9ebb-460e-a100-26b4839e1656">
<img width="1064" alt="postbox" src="https://github.com/hotaru-hspr/Prox/assets/145186759/e603f56f-b335-4177-8316-e4b632c8d74c">
<img width="1272" alt="post" src="https://github.com/hotaru-hspr/Prox/assets/145186759/c341a0af-1cf0-4445-aaed-a1f0643b14f0">
<img width="1259" alt="profile" src="https://github.com/hotaru-hspr/Prox/assets/145186759/3785423e-5310-44e2-b0ac-93b567d23f05">
<img width="1265" alt="egg" src="https://github.com/hotaru-hspr/Prox/assets/145186759/ad79ab4d-1a7e-4695-82a5-db3216cacbbe">

# Notes
1. A bug has been identified, which permanently stores the coordinates of the place where the website has been first opened and overwrites the newer coordinates after reloading. Error has been identified to be related to a sessionStorage/localStorage confusion and an initial fix has been released, which may or may not fix the issue. Please hang on until I get home and on the PC (I'm doing all these on mobile).

2. While the UI is dynamic on a desktop, it's not optimised for mobile. It barely works though, just don't expect it to look like another social media app optimized for mobile.
