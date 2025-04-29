export function validateForm(formData) {
    let newErrors = {};
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z0-9+\-#\s]+$/.test(formData.name)) {
      newErrors.name = "Name can contain letters, numbers, spaces, +, -, and #.";
    }
  
    // Developer validation
    if (!formData.developer.trim()) {
      newErrors.developer = "Developer is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.developer)) {
      newErrors.developer = "Developer name can contain only letters.";
    }
  
    // Year validation
    if (!formData.year) {
      newErrors.year = "Year is required.";
    } else if (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear()) {
      newErrors.year = "Enter a valid year (1900 - " + new Date().getFullYear() + ").";
    }
  
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 5) {
      newErrors.description = "Description must be at least 5 characters long.";
    }
  
    return newErrors;
  }