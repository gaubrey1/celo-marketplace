// This component is used to add a product to the marketplace and show the user's cUSD balance

// Importing the dependencies
import { useState } from "react";
// Import our custom useContractSend hook to write a product to the marketplace contract
import { useGift } from "@/hooks/contracts/useGiftProduct";

// The GiftModal component is used to add a product to the marketplace
const GiftModal = (productId:any) => {
  // The visible state is used to toggle the modal
  const [visible, setVisible] = useState(false);
  // The following states are used to store the values of the form fields
  const [recipientAddress, setRecipientAddress] = useState("");
  // The loading state is used to display a loading message
  const [loading, setLoading] = useState("");

  // Clear the input fields after the product is added to the marketplace
  const clearForm = () => setRecipientAddress("");


    // Use the useContractSend hook to use our writeProduct function on the marketplace contract and add a product to the marketplace
    const { writeAsync: gift } = useGift([productId.productId, recipientAddress]);
  
    // Define function that handles the creation of a product through the marketplace contract
    const handleGiftProduct = async () => {
      if (!gift) {
        throw "Failed to create product";
      }
      setLoading("Gifting...");
      if (!recipientAddress) throw new Error("Please fill all fields");
      // Create the product by calling the writeProduct function on the marketplace contract
      const purchaseTx = await gift();
      setLoading("Waiting for confirmation...");
      // Wait for the transaction to be mined
      await purchaseTx.wait();
      // Close the modal and clear the input fields after the product is added to the marketplace
      setVisible(false);
      alert("Successfully gifted product...")
      clearForm();
    };

  // Define the JSX that will be rendered
  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div className="w-full">
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Gift
        </button>

        {/* Modal */}
        {visible && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
            {/* Form with input fields for the product, that triggers the addProduct function on submit */}
            <form>
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Input fields for the product */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <label>Recipient Address</label>
                    <input
                      onChange={(e) => {
                        setRecipientAddress(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />
                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    {/* Button to add the product to the marketplace */}
                    <button
                      type="submit"
                      onClick={(e)=> {
                        e.preventDefault();
                        handleGiftProduct();
                      }}
                      disabled={!!loading || !recipientAddress || !gift}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                    >
                      {loading ? loading : "Gift"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftModal;