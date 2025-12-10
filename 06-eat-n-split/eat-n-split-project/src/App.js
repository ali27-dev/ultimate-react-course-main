import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [seletedFriend, setSelectedFriend] = useState(null);

  function handleClickEvent() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriends(friend) {
    setFriends((friend) => [...friend, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }
  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === seletedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          seletedFriend={seletedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriends={handleAddFriends} />}
        <Button onClick={handleClickEvent}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {seletedFriend && (
        <FormSplitBill
          seletedFriend={seletedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;

function FriendList({ friends, seletedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          seletedFriend={seletedFriend}
          key={friend.id}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, seletedFriend, onSelection }) {
  const isSelected = seletedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : null}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Slect"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriends(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <>
      <div className="form">
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <label htmlFor="">👬 Friend name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="">🌄 Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Button>Add</Button>
        </form>
      </div>
    </>
  );
}

function FormSplitBill({ seletedFriend, onSplitBill }) {
  const [isBill, setIsBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const finalPayment = isBill ? isBill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("User");

  function handleSubmit(e) {
    e.preventDefault();

    if (!isBill || !paidByUser) return;

    onSplitBill(whoIsPaying === "User" ? paidByUser : -paidByUser);
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        {/* <div className="form"> */}
        <h2>Split a Bill With {seletedFriend.name}</h2>
        <label htmlFor="">💰 Bill Value</label>
        <input
          type="text"
          value={isBill}
          onChange={(e) => setIsBill(+e.target.value)}
        />
        <label htmlFor="">🧍‍♂️ Your expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > isBill ? paidByUser : +e.target.value
            )
          }
        />
        <label htmlFor="">👬 {seletedFriend.name} expense:</label>
        <input type="text" value={finalPayment} disabled />
        <label htmlFor="">🤑 Who is paying the bill?</label>
        <select
          name=""
          id=""
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{seletedFriend.name}</option>
        </select>
        <Button>Split bill</Button>
        {/* </div> */}
      </form>
    </>
  );
}
