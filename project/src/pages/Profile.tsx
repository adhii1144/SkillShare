import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, MapPin, Mail, Phone, Globe, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    email: '',
    mobile: '',
    website: '',
    bio: '',
    address: '',  // Add address as needed
  });
  const [skills, setSkills] = useState([
    { id: 1, name: 'Web Development', level: 'Expert' },
    { id: 2, name: 'UI/UX Design', level: 'Intermediate' },
    { id: 3, name: 'Digital Marketing', level: 'Beginner' }
  ]);
  const [newSkill, setNewSkill] = useState('');  // State to store the new skill input
  const [skillLevel, setSkillLevel] = useState('Beginner');  // State to store the selected skill level
  const [loading, setLoading] = useState(true);  // Loading state for the profile data
  const [error, setError] = useState(null);  // Error state for handling errors

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt');  // Retrieve JWT token from localStorage

        if (!token) {
          toast.error('No token found. Please log in!');
          return;
        }

        const response = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load profile data: ${response.statusText}`);
        }

        const profile = await response.json();

        setProfileData({
          name: profile.name,
          title: profile.title,
          email: profile.email,
          mobile: profile.mobile,  // Assuming `mobile` is the key in your backend response
          website: profile.website || '',  // Default to an empty string if website is undefined
          bio: profile.bio,
          address: profile.address || 'N/A',  // Assuming address is part of the profile data
        });
        
        // Assuming skills are part of the profile data
        setSkills(profile.skills || []);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);  // Show error if something goes wrong
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileUpdate = (newData) => {
    setProfileData(newData);
    toast.success('Profile updated successfully!');
  };

  const handleDeleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
    toast.success('Skill removed successfully!');
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a valid skill!');
      return;
    }

    const newSkillObject = {
      id: Date.now(),  // Using the current timestamp as a unique ID for the new skill
      name: newSkill,
      level: skillLevel,  // Use the selected skill level
    };

    setSkills([...skills, newSkillObject]);
    setNewSkill('');  // Reset the input field after adding the skill
    setSkillLevel('Beginner');  // Reset skill level to default
    toast.success('Skill added successfully!');
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={profileData.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}  // Add profile image if available
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
            >
              <Pencil className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.title}</p>
              </div>
              <Button
                variant="secondary"
                className="!w-auto"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <motion.div whileHover={{ y: -2 }} className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {profileData.address}
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                {profileData.email}
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                {profileData.mobile}
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                {profileData.website}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        </div>

        {/* New Skill Form (Styled as Edit Profile Button) */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-3/4"
              placeholder="Enter new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="border border-gray-300 p-2 rounded-md ml-2"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <Button
            onClick={handleAddSkill}
            className="!w-auto mt-4"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Skill
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(skill => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
            >
              <SkillTag
                name={skill.name}
                level={skill.level}
                onDelete={() => handleDeleteSkill(skill.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
        <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
      </motion.div>

      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleProfileUpdate}
        initialData={profileData}
      />
    </motion.div>
  );
};

export default Profile;
