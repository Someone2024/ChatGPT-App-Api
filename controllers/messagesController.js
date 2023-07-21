const db = require("./FirebaseController");
const runConversation = require("../lib/OpenAi");
const { collection, query, where, getDocs } = require("firebase/firestore");

exports.sendMessage = async (req, res) => {
  const { inputValue } = req.body;
  try {
    const newUserMessage = await addDoc(collection(db, "UserMessages"), {
      role: "user",
      content: inputValue,
      author: req.username,
      createdAt: new Date(),
      isAi: false,
    });
    runConversation(inputValue, `${req.username}`).then(async (result) => {
      const newAiMessage = await addDoc(collection(db, "AiMessages"), {
        role: "assistant",
        content: result,
        author: req.username,
        createdAt: new Date(),
        isAi: true,
      });
      res.json({
        message: "Messages created successfully",
        aiMessage: newAiMessage.content,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

exports.displayMessages = async (req, res) => {
  function Message(role, content) {
    this.role = role;
    this.content = content;
  }

  function addMessage(role, content) {
    const message = new Message(role, content);
    messages.push(message);
  }

  function addMessage(role, content) {
    const message = new Message(role, content);
    messages.push(message);
  }

  let messages = [];

  const userMessagesQuery = query(
    collection(db, "UserMessages"),
    where("author", "==", req.username)
  );
  const AiMessagesQuery = query(
    collection(db, "AiMessages"),
    where("author", "==", req.username)
  );

  const userMessagesSnapshot = await getDocs(userMessagesQuery);
  const AiMessagesSnapshot = await getDocs(AiMessagesQuery);

  const userMessagesArray = userMessagesSnapshot.docs.map((doc) => doc.data());
  const aiMessagesArray = AiMessagesSnapshot.docs.map((doc) => doc.data());

  const maxLength = Math.max(userMessagesArray.length, aiMessagesArray.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < userMessagesArray.length) {
      const userMessage = userMessagesArray[i];
      addMessage("user", userMessage.content);
    }
    if (i < aiMessagesArray.length) {
      const aiMessage = aiMessagesArray[i];
      addMessage("assistant", aiMessage.content);
    }
  }

  messages.push(new Message("user", msg));

  res.json(messages)
};