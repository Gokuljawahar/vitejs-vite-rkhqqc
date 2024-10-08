import { useState } from 'react';
import {
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';
import { regions } from './regions';
import { emailRegex, nameRegex } from './Validations';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    region: '',
    regionCode: '',
    phoneNumber: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters (including spaces) for first and last names
    if (
      (name === 'firstName' || name === 'lastName') &&
      !nameRegex.test(value) &&
      value !== ''
    ) {
      return;
    }

    // Handle phone number formatting
    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Reset errors for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    const code = regions[selectedRegion]; // Get the region code
    setFormData((prev) => ({
      ...prev,
      region: selectedRegion, // Set the selected country name
      regionCode: code, // Set the region code based on selection
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (
      !formData.phoneNumber ||
      formData.phoneNumber.replace(/\D/g, '').length > 10
    ) {
      newErrors.phoneNumber = 'Phone number must of 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionSuccess(true);
        setTimeout(() => setSubmissionSuccess(false), 3000); // Hide message after 3 seconds
        setFormData({
          firstName: '',
          lastName: '',
          region: '',
          regionCode: '', // Reset region code
          phoneNumber: '',
          email: '',
        }); // Reset form
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="centered-form">
        <div className="box">
          <h2>Sign Up</h2>
          {submissionSuccess && (
            <Box bg="green.500" color="white" p={3} mb={4} borderRadius="md">
              <Text>Form submitted successfully!</Text>
            </Box>
          )}
          <div className="container">
            <FormControl isInvalid={!!errors.firstName}>
              <Input
                name="firstName"
                variant="filled"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <Input
                name="lastName"
                variant="filled"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>
          </div>
          <div className="container">
            <FormControl isInvalid={!!errors.region}>
              <Select
                name="region"
                className="Region_container"
                placeholder="Region"
                value={formData.region}
                onChange={handleRegionChange}
              >
                {Object.keys(regions).map((country) => (
                  <option key={country} value={country}>
                    {country} {/* Display the country name */}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>{errors.region}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <Input
                name="regionCode"
                variant="filled"
                value={formData.regionCode} // Correctly display the region code
                readOnly // Make it read-only
                placeholder="Region Code"
              />
            </FormControl>
          </div>
          <div className="container">
            <FormControl isInvalid={!!errors.phoneNumber}>
              <Input
                name="phoneNumber"
                className="phone_number"
                type="tel"
                variant="filled"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
          </div>
          <div className="container">
            <FormControl isInvalid={!!errors.email}>
              <Input
                name="email"
                variant="filled"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </div>
          <div className="button-container">
            <Button type="submit" colorScheme="blue" mt="4">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default App;
