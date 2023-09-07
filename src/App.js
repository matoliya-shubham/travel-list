import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function handleDeleteItem(id) {
    setItems((items) => items.filter((el) => el.id !== id));
  }

  function handleToggleItem(id) {
    setItems((itens) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function clearItemList() {
    const confirmed = window.confirm(
      "are you sure you want to delete all items in the list ?"
    );
    if (confirmed) setItems([]);
  }
  return (
    <>
      <Logo />
      <Form onAddItem={handleAddItems} />
      <PackingList
        packListItems={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        clearItemList={clearItemList}
      />
      <Stats items={items} />
    </>
  );
}

function Logo() {
  return <h1> Far away</h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    console.log(newItem);
    setDescription("");
    setQuantity(1);
    onAddItem(newItem);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({
  packListItems,
  onDeleteItem,
  onToggleItem,
  clearItemList,
}) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = packListItems;
  if (sortBy === "description")
    sortedItems = packListItems
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  //slice is using to make copy of array
  if (sortBy === "packed")
    sortedItems = packListItems
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul className="list">
        {sortedItems.map((item, i) => (
          <Item
            key={i}
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value={"input"}>Sort by input order</option>
          <option value={"description"}>Sort by description</option>
          <option value={"packed"}>Sort by packed status</option>
        </select>
        <button onClick={clearItemList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onClick={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button style={{ color: "red" }} onClick={() => onDeleteItem(item.id)}>
        X
      </button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Start adding items to the list</em>
      </footer>
    );

  const numItems = items.length;
  const numPackedItems = items.filter((item) => item.packed).length;
  return (
    <footer className="stats">
      {numPackedItems == numItems ? (
        <em>You got everything! Ready to go </em>
      ) : (
        <em>
          You have {numItems} items on your list, and you already packed
          {` ${numPackedItems} (${eval(
            (numPackedItems / numItems).toFixed(4) * 100
          )}%)`}
        </em>
      )}
    </footer>
  );
}
