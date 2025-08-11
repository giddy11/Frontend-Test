// import React from 'react';
// // import NotificationList from './NotificationList';
// // import SendNotificationForm from './SendNotificationForm';
// // import Chatty from './Chatty';
// // import RoomsChat from './Rooms';
// import ProfilePictureUpload from './profilePictureUpload';
// import PaystackTest from './PaystackTest';

// const App = () => {
//   const userId = 'f0aaa0c1-1cd7-4846-925c-ef57fc78532c'; // Replace with actual user ID from auth
//   const communityId = '3f4288a1-9f8b-4f07-970b-b30e7c2f0557'; // Replace with desired community ID

//   return (
//     <div className="container mx-auto p-4">
//       {/* <h1 className="text-3xl font-bold text-center mb-8">Notification Tester</h1> */}
//       {/* <SendNotificationForm userId={userId} communityId={communityId} /> */}
//       {/* <NotificationList userId={userId} communityId={communityId} /> */}
//       {/* <Chatty/> */}
//       {/* <RoomsChat/> */}
//       {/* <ProfilePictureUpload/> */}
//       <PaystackTest/>
//     </div>
//   );
// };

// export default App;

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PaystackSubscription from "./PaystackSubscription";
// import Callback from "./pages/Callback";
import PaystackSubscription from "./PaystackSubscription";
import Callback from "./Callback";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailed from "./PaymentFailed";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaystackSubscription />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Routes>
    </Router>
  );
}
