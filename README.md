# SAFEPULSE
# 🌐 SafePulse: Emergency Alert and Threat Detection System

SafePulse is a real-time web application designed to enhance public safety by allowing users to report suspicious activities, trigger emergency alerts, and view danger zones based on location-based threat analysis. It leverages geolocation, WebSockets, and email notifications to alert nearby users and authorities during potential emergencies.

---

## 🚀 Features

-  **Emergency Button** to alert nearby users instantly.
-  **Geolocation Tracking** to identify user location and detect threats nearby.
-  **Threat Level Detector** based on density of suspicious reports.
-  **Real-Time Broadcasts** via Socket.io.
-  **Email Alerts** sent to authorities when reports are filed.
-  **Heatmap of Danger Zones** based on past user reports.
-  **Trusted Contact Management** for emergency notifications.
-  **MongoDB** integration for storing reports and contacts.

---

##  Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB + Mongoose
- **Email**: Nodemailer (Gmail SMTP)
- **Geolocation**: Browser Geolocation API
- **Mapping**: Leaflet.js

---

## 📂 Project Structure

SafePulse/
├── public/
│ ├── index.html
│ ├── map.html
│ ├── guide.html
│ ├── helpline.html
│ ├── safety.html
│ └── js/
│ ├── app.js
│ ├── map.js
│ ├── guide.js
│ ├── helpline.js
│ └── safety.js
├── model/
│ ├── report.js
│ └── contact.js
├── .env
├── server.js 
├── package.json
└── README.md

