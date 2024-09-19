import { useState } from "react";
import axios from "axios";

const AddLoan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    interestRate: "",
    term: "",
    loanType: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle the popup
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload
    const loanData = {
      amount: formData.amount,
      interest_rate: formData.interestRate,
      term: formData.term,
      loan_type: formData.loanType,
    };

    try {
      // Send the data via POST request to the API
      const response = await axios.post(
        "http://127.0.0.1:8000/loans/",
        loanData
      );
      console.log("API Response:", response.data);

      // Show success message
      setSuccessMessage("Loan added successfully!");
      setErrorMessage("");

      // Clear form data
      setFormData({
        amount: "",
        interestRate: "",
        term: "",
        loanType: "",
      });

      // Optionally close the popup
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding loan:", error);
      setErrorMessage("Failed to add loan. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center   bg-gray-100">
      <button
        onClick={togglePopup}
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 mt-4"
      >
        Add Loan
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Loan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interest Rate (%):
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Term (Months):
                </label>
                <input
                  type="number"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loan Type:
                </label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Loan Type</option>{" "}
                  {/* Placeholder option */}
                  <option value="Personal">Personal</option>
                  <option value="Auto">Auto</option>
                  <option value="Mortgage">Mortgage</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-600"
              >
                Submit
              </button>
            </form>
            <button
              onClick={togglePopup}
              className="mt-4 text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <p className="mt-4 text-lg font-semibold text-green-600">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 text-lg font-semibold text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AddLoan;
