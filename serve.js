const crypto = require("crypto");
const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);

// HTMLやJSなどを配置するディレクトリ
const DOCUMENT_ROOT = __dirname + "/public";

/**
 * "/"にアクセスがあったらindex.htmlを返却
 */
app.get("/", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});
app.get("/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});

socketNames = [];
nameNames = [];
let shutsudaiMan = null;
/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket)=>{
  console.log("ユーザーが接続しました"+socket.id);

  //---------------------------------
  // ログイン
  //---------------------------------
  (()=>{
    // トークンを作成
    const token = socket.id;

    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();

  //---------------------------------
  // 発言を全員に送信
  //---------------------------------
  socket.on("namae-kimari", (namae)=>{
    socketNames.push(namae.soketId);
    nameNames.push(namae.name) 

    allname = nameNames.join()
    io.emit("namae-kimaridesu", allname,shutsudaiMan);
  });

  socket.on("shutsudai-post", (shutsudaiMsg)=>{
    io.emit("shutsudai-post", shutsudaiMsg);
  });

  socket.on("shutsudai-shimasu", (shutsudaiSya)=>{
    shutsudaiMan = shutsudaiSya.name;
    io.emit("shutsudai-kimari",shutsudaiSya);
  });

  socket.on("kaitou-shimasu", (kaitouSya)=>{
    io.emit("kaitou-kimari",kaitouSya);
  });

  socket.on("kaitou-txt-post", (kaitouMsg)=>{
    io.emit("re-kaitou-txt-post",kaitouMsg);    
    
  });

  socket.on("seikai-desu", (kaitouMsg)=>{
    io.emit("seikai-desune",kaitouMsg);
});

socket.on("machigai-desu", (kaitouMsg)=>{
  io.emit("machigai-desune",kaitouMsg);
});
socket.on("jikangire-desu", (kaitouMsg)=>{
  io.emit("jikangire-desune",kaitouMsg);  
});

socket.on("next-desu", (kaitouMsg)=>{
  io.emit("next-desune",kaitouMsg);  
});

socket.on("shutsudai-yamemasu", ()=>{
  shutsudaiMan = null;
  io.emit("shutsudai-yamemasuyo",);  

});

socket.on('disconnect', () => {
var result = 0
  result = socketNames.indexOf(socket.id);

  if (socketNames.includes(socket.id))
  {
    socketNames.splice(result, 1);  
    nameNames.splice(result, 1);  
  } else{
return(false)
  }

allname = nameNames.join()
io.emit("namae-kimaridesu", allname);

});


});



const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("listening server")
})
/**
 * 3000番でサーバを起動する
 */
http.listen(3000, ()=>{
  console.log("listening on *:3000");
});

/**
 * トークンを作成する
 *
 * @param  {string} id - socket.id
 * @return {string}
 */
function makeToken(id){
  const str = "aqwsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
}