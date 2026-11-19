import { useState } from "react";

function InventoryShipment({ bags, setBags, shipments, setShipments }) {
  const [selectedIndex, setSelectedIndex] = useState("");
  const [shipQuantity, setShipQuantity] = useState("");

  function handleShip(event) {
    event.preventDefault();

    const bag = bags[selectedIndex];
    const amount = Number(shipQuantity);

    // Quantity must be a positive number
    if (amount < 1) {
      alert("Quantity must be 1 or more.");
      return;
    }

    // Do not allow a shipment if there is not enough stock
    if (amount > Number(bag.quantity)) {
      alert("Not enough stock. Available: " + bag.quantity);
      return;
    }

    // Subtract the shipped quantity from the stock
    const newBags = bags.map((item, index) => {
      if (index === Number(selectedIndex)) {
        return { ...item, quantity: Number(item.quantity) - amount };
      }
      return item;
    });
    setBags(newBags);

    // Save the shipment record
    const newShipment = {
      productName: bag.productName,
      productCode: bag.productCode,
      color: bag.color,
      quantity: amount,
      date: new Date().toLocaleDateString(),
    };
    setShipments([...shipments, newShipment]);
  }

  function handleDelete(indexToDelete) {
    const newBags = bags.filter((bag, index) => index !== indexToDelete);
    setBags(newBags);
  }

  return (
    <>
      <div className="card">
        <h2>Record Bag Shipments</h2>

        <form onSubmit={handleShip}>
          <select required onChange={(e) => setSelectedIndex(e.target.value)}>
            <option value="">Select a bag</option>
            {bags.map((bag, index) => (
              <option key={index} value={index}>
                {bag.productName} ({bag.productCode}) - Stock: {bag.quantity}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity to ship"
            required
            onChange={(e) => setShipQuantity(e.target.value)}
          />

          <button type="submit" className="buttonTab">
            Ship
          </button>
        </form>

        <h3>Current Stock</h3>

        <section className="table">
          <article className="tableHeader">
            <div>Product Name</div>
            <div>Quantity</div>
            <div>Action</div>
          </article>

          {bags.length === 0 && (
            <article className="tableRow">No bags yet.</article>
          )}

          {bags.map((bag, index) => (
            <article className="tableRow" key={index}>
              <div>{bag.productName}</div>
              <div>{bag.quantity}</div>
              <div>
                <button
                  type="button"
                  className="buttonTab"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

export default InventoryShipment;
