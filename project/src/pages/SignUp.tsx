import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    title: '',
    bio: '',
    address: '',
    website : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (!formData.address) {
      setErrors({ address: 'Please enter your address' });
      setIsLoading(false);
      return;
    }
    

    try {
      // Send data to the backend
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          title: formData.title,
          bio: formData.bio,
          address: formData.address,
          website : formData.website,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error( 'Failed to register user');
      }

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error( 'Failed to create account');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community of skilled professionals"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Mobile number"
          type="string"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          error={errors.mobile}
          required
        />

        <Input
          label="Professional title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g., Full Stack Developer"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <Input
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
        />

      <Input
          label="Website"
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
