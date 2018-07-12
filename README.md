# **Syllabary**
## *by* **Jason Charney** *for* **SPLICE Ensemble** (2018)

## Requirements:
- Three score reading revices (tablets or laptops at stations)
- A computer running the Max patch and Node Express server (can be one of the score readers).
- A stable WiFi network (prefereably a local one to decrease latency)
---
## Installation:
1. Download this repository as a zip file. Unzip and move to desired directory, but leave the unzipped folder organized as it is.
---
## Before performance:

**Update host IP:** 

*Do this each time the network changes or the host computer reconnects. Sometimes dynamic IP addresses will be assigned, but the address should be stable as long as the server device remains connected. You can skip this if you have a static IP/aren't reconfiguring the network.*

1. Open Terminal and run `ifconfig` . Find the IP address of the computer on the current WiFi network (probably labeled with `en0` in front of it).
2. Change the `hostIP` entry in `ports.JSON` (be sure to keep the quotes around it) and save.

**Open the Syllabary project in Max:**
1. Drag and drop `ports.JSON` into the filedrop in `Syllabary.maxpat`. Refresh the project.

**Run the server:**

In terminal, `cd` to the folder where `SyllabaryServer.js` is located. Enter:
 
`node SyllabaryServer.js`

If the server is successfully running and ready, the patch should show the server status as "ON".

**On each device:**
1. Make sure you're on the same WiFi network as the server.
2. Open a browser window with the device in landscape orientation. Navigate to the address formatted like this:

`hostIP:expressPort`

e.g.: `10.1.10.55:3000`

You should see a black screen and three buttons with your names on them. Press your name to link your device. The piece cannot begin unless three unique readers are connected.