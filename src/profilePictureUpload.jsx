import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0YjFiY2YyLWM1MDctNDFlYy1hMDU4LTY0M2M1MWYzZWNlYyIsImlhdCI6MTc1NDgyMTM1NCwiZXhwIjoxNzU1MDgwNTU0fQ.k-6pHDOkGl90v12DZk6Jo2-14djW1RWdoA7Wim5bAzw'; // Replace with actual token

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!file) {
      setError('Please select a file');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/profile-image', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage('Upload successful!');
      console.log('Server response:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Profile Picture Upload Test</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          {preview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !file}
          style={{ 
            padding: '10px 15px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload Profile Picture'}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#d4edda', 
          color: '#155724',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;