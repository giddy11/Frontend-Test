// import React, { useState } from 'react';
// import { sendTestNotification } from './api';

// const SendNotificationForm = ({ userId, communityId }) => {
//   const [formData, setFormData] = useState({
//     entityType: 'Test',
//     entityId: communityId || 'test-123',
//     message: '',
//     recipients: [userId],
//     socketRoom: communityId ? `entity:${communityId}` : 'entity:test-123',
//     metadata: {},
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await sendTestNotification(formData);
//       alert('Notification sent!');
//       setFormData({ ...formData, message: '' });
//     } catch (error) {
//       console.error('Failed to send notification:', error);
//       alert('Failed to send notification');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8">
//       <h2 className="text-xl font-bold mb-4">Send Test Notification</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Entity Type</label>
//           <input
//             type="text"
//             name="entityType"
//             value={formData.entityType}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Entity ID</label>
//           <input
//             type="text"
//             name="entityId"
//             value={formData.entityId}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Message</label>
//           <input
//             type="text"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Socket Room</label>
//           <input
//             type="text"
//             name="socketRoom"
//             value={formData.socketRoom}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Send Notification
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SendNotificationForm;