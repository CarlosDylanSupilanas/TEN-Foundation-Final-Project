import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InventoryMain from "../Components/InventoryMain";
import InventoryShipment from "../Components/InventoryShipment";
import { BAG_URL } from "../api/bagApi";
import "../StyleInventory.css";

function Inventory() {

  const navigate = useNavigate();

  const [bags, setBags] = useState([]);

  // Gets all bags from the database and saves them in bags
  async function loadBags() {
    const response = await fetch(BAG_URL);
    const data = await response.json();
    setBags(data);
  }

  // Runs once when the page opens
  useEffect(() => {
    async function firstLoad() {
      const response = await fetch(BAG_URL);
      const data = await response.json();
      setBags(data);
    }
    firstLoad();
  }, []);

  // Removes the saved login, then goes to the sign in page
  function handleLogout() {
    localStorage.clear();
    navigate("/signin", { replace: true });
  }

  return (
    <>
      <div className="inventory">

        <h1>Ten-Foundation Bag Inventory</h1>

        <div className="menu">
          <Link className="buttonTab buttonDark" to="/admin">Worker Dashboard</Link>
          <button type="button" className="buttonTab" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <InventoryMain bags={bags} loadBags={loadBags} />

        <InventoryShipment bags={bags} loadBags={loadBags} />

      </div>
    </>
  );

}

export default Inventory;