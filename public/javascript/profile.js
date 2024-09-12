document.addEventListener("DOMContentLoaded", () => {
    // Configure Cloudinary upload widget
    const cloudinaryWidget = cloudinary.createUploadWidget(
      {
        cloudName: 'dgjxunxmq', 
        uploadPreset: 'my-preset',
        cropping: true,
        croppingAspectRatio: 1,
        showAdvancedOptions: true,
        multiple: false,
        autoMinimize: true
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
          return;
        }
  
        if (result.event === 'success') {
          const imageUrl = result.info.secure_url;
          console.log('Image uploaded successfully:', imageUrl);
  
          // Update the profile picture on the page
          document.getElementById('profileImg').src = imageUrl;
  
          // Send the image URL to the backend
          const token = localStorage.getItem("token");
          axios.post('/api/users/saveProfilePic', { profilePicture: imageUrl }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            alert('Profile picture updated successfully!');
          })
          .catch(error => {
            console.error('Error updating profile picture:', error);
            alert('Error updating profile picture');
          });
        }
      }
    );
  
    // Open Cloudinary widget when the "Upload New Picture" button is clicked
    document.getElementById('uploadBtn').addEventListener('click', () => {
      cloudinaryWidget.open();
    });
  
    // Fetch and display user profile data
    const token = localStorage.getItem("token");
    if (token) {
      axios.get('/api/users/getProfile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const user = response.data;
        console.log(user);
  
        // Use a default image if the user has no profile picture
        document.getElementById('profileImg').src = user.profilePicture || 'https://www.w3schools.com/w3images/avatar2.png';
        document.getElementById('profileName').textContent = user.username || 'User Name';
        document.getElementById('profileEmail').textContent = user.email || 'user@example.com';
        document.getElementById('profileRole').textContent = user.role || 'User Role';
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        alert('Error fetching user profile');
      });
    } else {
      window.location.href = "/login.html";
    }
  });
  