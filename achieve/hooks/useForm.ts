import { useState } from "react";
const useForm = (values:any) => {
  const [formData, setFormData] = useState(values);
  const setFormValue = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  const resetFormValues = () => {
    setFormData(values);
  };
  return [formData, setFormValue, resetFormValues];
};

export default useForm;
