// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import {
//   fetchNotifications,
//   fetchCommunityNotifications,
//   markNotificationAsRead,
// } from "./api";

// const NotificationList = ({ userId, communityId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // useEffect(() => {
//   //   const loadNotifications = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);

//   //       const fetchedNotifications = communityId
//   //         ? await fetchCommunityNotifications(communityId)
//   //         : await fetchNotifications();

//   //       // Debug: Log the response to see its structure
//   //       console.log("Fetched notifications:", fetchedNotifications);

//   //       // Handle different response formats
//   //       let notificationArray;
//   //       if (Array.isArray(fetchedNotifications)) {
//   //         notificationArray = fetchedNotifications;
//   //       } else if (
//   //         fetchedNotifications?.notifications &&
//   //         Array.isArray(fetchedNotifications.notifications)
//   //       ) {
//   //         notificationArray = fetchedNotifications.notifications;
//   //       } else if (
//   //         fetchedNotifications?.data &&
//   //         Array.isArray(fetchedNotifications.data)
//   //       ) {
//   //         notificationArray = fetchedNotifications.data;
//   //       } else {
//   //         console.warn("Unexpected API response format:", fetchedNotifications);
//   //         notificationArray = [];
//   //       }

//   //       setNotifications(notificationArray);
//   //     } catch (error) {
//   //       console.error("Failed to fetch notifications:", error);
//   //       setError(error.message);
//   //       setNotifications([]); // Ensure it's always an array
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   loadNotifications();
//   // }, [communityId]);

// //   useEffect(() => {
// //     const socket = io("http://localhost:3834", {
// //       withCredentials: true,
// //       extraHeaders: { Authorization: `Bearer ${userId}` },
// //     });

// //     const room = communityId ? `entity:${communityId}` : "user:notifications";
// //     socket.emit("join", room);

// //     socket.on("notification", (notification) => {
// //       setNotifications((prev) => {
// //         // Ensure prev is always an array
// //         console.log("notify: ", notification);
// //         const currentNotifications = Array.isArray(prev) ? prev : [];
// //         return [notification, ...currentNotifications];
// //       });
// //     });

// //     socket.on("connect", () => {
// //       console.log("socket2", socket.id); // x8WIv7-mJelg7on_ALbx
// //     });

// //     socket.on("disconnect", () => {
// //       console.log("socket disconnect: ", socket.id); // undefined
// //     });

// //        socket.on("hello", (arg, arg1) => {
// //   console.log("from backend: ", arg); // world
// // });

// // //     socket.on("hello", (arg, arg1) => {
// // //   console.log("from backend: ", arg); // world
// // // });

// // // socket.emit("update item", "1", { name: "updated" }, (response) => {
// // //   console.log(response.status); // ok
// // // });

// // // let count = 0;
// // // setInterval(() => {
// // //   // socket.volatile.emit("ping", ++count);
// // //   socket.emit("ping", ++count);

// // // }, 1000);

// //     // socket.on("connect_error", (error) => {
// //     //   console.error("Socket connection error:", error);
// //     // });

// //     socket.on("connect_error", (error) => {
// //   if (socket.active) {
// //     // temporary failure, the socket will automatically try to reconnect
// //   } else {
// //     // the connection was denied by the server
// //     // in that case, `socket.connect()` must be manually called in order to reconnect
// //     console.log(error.message);
// //   }
// // });

// //     return () => socket.disconnect();
// //   }, [communityId, userId]);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await markNotificationAsRead(notificationId);
//       setNotifications((prev) =>
//         prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
//       );
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-2xl mx-auto mt-4">
//         <h2 className="text-2xl font-bold mb-4">Notifications</h2>
//         <p className="text-gray-500">Loading notifications...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto mt-4">
//         <h2 className="text-2xl font-bold mb-4">Notifications</h2>
//         <p className="text-red-500">Error loading notifications: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-4">
//       <h2 className="text-2xl font-bold mb-4">Notifications</h2>
//       {!Array.isArray(notifications) || notifications.length === 0 ? (
//         <p className="text-gray-500">No notifications yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {notifications.map((notification, index) => (
//             <li
//               key={notification.id || `${notification.entityId}-${index}`}
//               className={`p-4 rounded-lg shadow-md ${
//                 notification.isRead ? "bg-gray-100" : "bg-blue-100"
//               }`}
//             >
//               <p className="font-semibold">{notification.message}</p>
//               <p className="text-sm text-gray-600">
//                 {notification.entityType}: {notification.entityId}
//               </p>
//               {notification.metadata && (
//                 <pre className="text-xs text-gray-500">
//                   {JSON.stringify(notification.metadata, null, 2)}
//                 </pre>
//               )}
//               <p className="text-xs text-gray-400">
//                 {notification.createdAt
//                   ? new Date(notification.createdAt).toLocaleString()
//                   : new Date().toLocaleString()}
//               </p>
//               {!notification.isRead && (
//                 <button
//                   onClick={() => handleMarkAsRead(notification.id)}
//                   className="mt-2 text-sm text-blue-500 hover:underline"
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default NotificationList;
