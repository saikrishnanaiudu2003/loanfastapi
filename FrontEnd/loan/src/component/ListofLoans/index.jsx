import  { useEffect, useState } from 'react';
import axios from 'axios';

const ListofLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState('');
  const [interestRateFilter, setInterestRateFilter] = useState('');

  // Fetch the list of loans
  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/loans/');
      setLoans(response.data);
      setFilteredLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setErrorMessage('Error fetching loans.');
    }
  };

  // Fetch loans on component mount and set up interval
  useEffect(() => {
    fetchLoans(); // Initial fetch

    // Set up interval to fetch loans every 1 second
    const intervalId = setInterval(() => {
      fetchLoans();
    }, 1000); // 1000 milliseconds = 1 second

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle delete loan
  const deleteLoan = async (loanId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/loans/${loanId}`);
      fetchLoans(); // Fetch loans again after deletion
    } catch (error) {
      console.error('Error deleting loan:', error);
      setErrorMessage('Error deleting loan.');
    }
  };

  // Show loan details
  const showDetails = (loan) => {
    setSelectedLoan(loan);
  };

  // Handle filtering
  const filterLoans = () => {
    let updatedLoans = loans;

    // Apply loan type filter
    if (loanTypeFilter) {
      updatedLoans = updatedLoans.filter(
        (loan) => loan.loan_type.toLowerCase() === loanTypeFilter.toLowerCase()
      );
    }

    // Apply interest rate filter
    if (interestRateFilter) {
      updatedLoans = updatedLoans.filter(
        (loan) => loan.interest_rate === parseFloat(interestRateFilter)
      );
    }

    setFilteredLoans(updatedLoans);
  };

  // Trigger filterLoans when loanTypeFilter or interestRateFilter changes
  useEffect(() => {
    filterLoans();
  }, [loanTypeFilter, interestRateFilter, loans]);

  // Calculate loan details
  const calculateLoanDetails = (loan) => {
    const principal = loan.amount;
    const annualInterestRate = loan.interest_rate;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loan.term;

    const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const totalRepayment = monthlyPayment * numberOfPayments;
    const interestAmount = totalRepayment - principal;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
      interestAmount: interestAmount.toFixed(2)
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List of Loans</h1>

      {/* Error message */}
      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}

      {/* Filter section */}
      <div className="mb-4">
        <label className="mr-2">Filter by Loan Type:</label>
        <select
          value={loanTypeFilter}
          onChange={(e) => setLoanTypeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Personal">Personal</option>
          <option value="Auto">Auto</option>
          <option value="Mortgage">Mortgage</option>
        </select>

        <label className="ml-4 mr-2">Filter by Interest Rate:</label>
        <input
          type="number"
          value={interestRateFilter}
          onChange={(e) => setInterestRateFilter(e.target.value)}
          placeholder="e.g., 5"
          className="border p-2 rounded"
        />
      </div>

      {/* Loans list */}
      {filteredLoans.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Loan ID</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Interest Rate</th>
              <th className="px-4 py-2 border">Term (Months)</th>
              <th className="px-4 py-2 border">Loan Type</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-4 py-2 border">{loan.id}</td>
                <td className="px-4 py-2 border">{loan.amount}</td>
                <td className="px-4 py-2 border">{loan.interest_rate}%</td>
                <td className="px-4 py-2 border">{loan.term}</td>
                <td className="px-4 py-2 border">{loan.loan_type}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => showDetails(loan)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Show Details
                  </button>
                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="text-red-500 hover:underline ml-6"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans available.</p>
      )}

      {/* Loan details section */}
      {selectedLoan && (
        <div className="mt-8 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Loan Details</h2>
          <p><strong>Loan ID:</strong> {selectedLoan.id}</p>
          <p><strong>Amount:</strong> {selectedLoan.amount}</p>
          <p><strong>Interest Rate:</strong> {selectedLoan.interest_rate}%</p>
          <p><strong>Term:</strong> {selectedLoan.term} months</p>
          <p><strong>Loan Type:</strong> {selectedLoan.loan_type}</p>
          <p><strong>Monthly Payment:</strong> {calculateLoanDetails(selectedLoan).monthlyPayment}</p>
          <p><strong>Total Repayment:</strong> {calculateLoanDetails(selectedLoan).totalRepayment}</p>
          <p><strong>Interest Amount:</strong> {calculateLoanDetails(selectedLoan).interestAmount}</p>
        </div>
      )}
    </div>
  );
};

export default ListofLoans;
