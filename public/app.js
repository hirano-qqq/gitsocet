//自分自身の情報を入れる
const IAM = {
    token: null,  // トークン
    name: null,    // 名前
  };

  
  //-------------------------------------
  // STEP1. Socket.ioサーバへ接続
  //-------------------------------------
  const socket = io();
  
  // 正常に接続したら
  socket.on("connect", ()=>{
    // 表示を切り替える
    $("#nowconnecting").style.display = "none";   // 「接続中」を非表示
    $("#inputmyname").style.display = "block";    // 名前入力を表示
  });
  
  // トークンを発行されたら
  socket.on("token", (data)=>{
    IAM.token = data.token;
  });
  
  //-------------------------------------
  // STEP2. 名前の入力
  //-------------------------------------
  /**
   * [イベント] 名前入力フォームが送信された
   */
  $("#frm-myname").addEventListener("submit", (e)=>{
    // 規定の送信処理をキャンセル(画面遷移しないなど)
    e.preventDefault();
  
    // 入力内容を取得する
    const myname = $("#txt-myname");
    if( myname.value === "" ){
      return(false);
    }
  
    // 名前をセット
    $("#myname").innerHTML = myname.value;
    IAM.name = myname.value;
 
    
    socket.emit("namae-kimari",{
        soketId: IAM.token,
        name: IAM.name
      });
    

    // 表示を切り替える
    $("#inputmyname").style.display = "none";   // 名前入力を非表示
    $("#taiki").style.display = "block";         // チャットを表示
  });
  
  $("#kaitoupost").addEventListener("submit", (e)=>{
    e.preventDefault();

    // 入力内容を取得する
    const kaitouMsg = $("#kaitou-msg");
    if( kaitouMsg.value === "" ){
      return(false);
    }
    socket.emit("kaitou-txt-post", {
        text: kaitouMsg.value,
        token: IAM.token,
        name: IAM.name
      });
    
      // 発言フォームを空にする
      kaitouMsg.value = "";

  
             });



    $("#shutsudai-suru-post").addEventListener('submit',  (e)=> {
    e.preventDefault();

  
    $("#taiki").style.display = "none";   
    $("#shutsudai").style.display = "block";   

    socket.emit("shutsudai-shimasu", {
        token: IAM.token,
        name: IAM.name
      });

        });

        // $("#seikai-button").addEventListener('submit',  (e)=> {
        //     e.preventDefault();
        //     alert("正解！")

        // });

        // $("#machigai-button").addEventListener('submit',  (e)=> {
        //     e.preventDefault();
        //     alert("間違い！")

        // });





                

        $("#shutsudai-yameru-post").addEventListener('submit',  (e)=> {
            e.preventDefault();
            $("#shutsudai").style.display = "none";   
            $("#taiki").style.display = "block";   

            socket.emit("shutsudai-yamemasu", {

            });

        });
        
        socket.on("shutsudai-yamemasuyo", ()=>{

          const nameHyouji = document.querySelector("#shutsudaisya-name");
          nameHyouji.innerHTML ="出題者:null"

        })
        
socket.on("shutsudai-kimari", (shutsudaiSya)=>{

    var sName = shutsudaiSya.name
    // alert(sName + "が出題者になりました"); 
    popMsg(sName + "が出題者になりました")

    const nameHyouji = document.querySelector("#shutsudaisya-name");
    nameHyouji.innerHTML ="出題者: " + sName

    // var sToken = shutsudaiSya.token
    // const TokenHyouji = document.querySelector("#shutsudaisya-token");
    // TokenHyouji.innerHTML =sToken

    const outputBox = document.getElementById("shutsudaisya-token");
    outputBox.value = shutsudaiSya.token;

    var shushut = $("#shutsudaisya-token")

    if(IAM.token == shushut.value)
      {   

      return(false);  

  }else{
    $("#taiki").style.display = "block";   
    $("#shutsudai").style.display = "none";   


  }

});

  //-------------------------------------
  // STEP3. チャット開始
  //-------------------------------------
  /**
   * [イベント] 発言フォームが送信された
   */
  $("#frm-post").addEventListener("submit", (e)=>{
    // 規定の送信処理をキャンセル(画面遷移しないなど)
    e.preventDefault();

    // 入力内容を取得する
    const shutsudaiMsg = $("#shutsudai-msg");
    if( shutsudaiMsg.value === "" ){
      return(false);
    }
  
    // Socket.ioサーバへ送信
    socket.emit("shutsudai-post", {
      text: shutsudaiMsg.value,
      token: IAM.token,
      name: IAM.name
    });
  
    // 発言フォームを空にする
    shutsudaiMsg.value = "";
    $("#shutsudai").style.display = "none";   
    $("#next").style.display = "block";  

  });

  socket.on("namae-kimaridesu" , (allname,shutsudaiMan)=>{
    // const list = document.querySelector("#sankashas");
    // const li = document.createElement("li");
    // li.innerHTML = allname;
    // list.innerHTML = "参加者:" + li.innerHTML 

    
    const sankashaHyouji = document.querySelector("#sankashas");
    sankashaHyouji.innerHTML ="参加者:"+allname


    const nameHyouji = document.querySelector("#shutsudaisya-name");
    nameHyouji.innerHTML ="出題者:" + shutsudaiMan

  });
  
  /**
   * [イベント] 誰かが発言した
   */
  socket.on("shutsudai-post" , (shutsudaiMsg)=>{


    const outputBox = document.getElementById("hide-zenbun");
    outputBox.value = shutsudaiMsg.text;
    const shuM = shutsudaiMsg.text
    addMessage(shuM, 0);

  });
  
  
//   /**
//    * 発言を表示する
//    *
//    * @param {object}  shutsudaiMsg
//    * @param {boolean} [is_me=false]
//    * @return {void}
//    */

  function addMessage(shuM,count){

    $("#hayaoshi-mondai").style.display = "block";  


    let speed =250 

    // let count = 0;    
    const interval = setInterval(function() {
    let bunsho = shuM
    let sliceText1 = bunsho.slice(0, 1+count)

      const list = document.querySelector("#msglist");
      const li = document.createElement("li");
      li.innerHTML = sliceText1;
      list.innerHTML = li.innerHTML

      const outputBox2 = document.getElementById("hide-mondaibun");
      outputBox2.value = sliceText1;
  
      count++;

      socket.on("kaitou-kimari", ()=>{
        clearInterval(interval);
      })

      socket.on("next-desune", ()=>{
        clearInterval(interval);
      })
    
      if (count === bunsho.length) {
    
        clearInterval(interval);
    
      }
    
    }, speed);
    

    
    
     
    var shushut = $("#shutsudaisya-token")
    var kaitoka = $("#kaitousya-token")
    if(IAM.token == shushut.value || IAM.token == kaitoka.value)
        {   

        return(false);  

    }else{
    $("#taiki").style.display = "none";   
    $("#shutsudai-suru").style.display = "none";   
    $("#hayaoshi-button").style.display = "block";   



    }
  }

  $("#hayaoshi-post").addEventListener('submit',  (e)=> {
    e.preventDefault();

    $("#hayaoshi-button").style.display = "none";   
    $("#kaitou").style.display = "block";   

    socket.emit("kaitou-shimasu", {
        token: IAM.token,
        name: IAM.name
      });

        });

        socket.on("kaitou-kimari", (kaitouSya)=>{
            $("#stop-hayaoshi-mondai").style.display = "block";
            $("#hayaoshi-mondai").style.display = "none";
            $("#next").style.display = "none";   


            const stopmondai = $("#hide-mondaibun")

            // alert(stopmondai.value)

            let hyouji = stopmondai.value

            const stoplist = document.querySelector("#stop-msglist");
            const stopli = document.createElement("stopli");
            stopli.innerHTML = hyouji;
            stoplist.innerHTML = stopli.innerHTML

            const outputBox = document.getElementById("kaitousya-token");
            outputBox.value = kaitouSya.token;
        
            const re_is_me = (kaitouSya.token === IAM.token);
            kaitouPop(kaitouSya, re_is_me);
          });

          function kaitouPop(kaitouSya, re_is_me=false){

            const klist = document.querySelector("#kotae");
            const kli = document.createElement("kli");
            kli.innerHTML = ``;
            klist.innerHTML = kli.innerHTML
            
            if( re_is_me ){
                return
        
            }else{
            $("#hayaoshi-button").style.display = "none";  
            $("#kaitou-pop").style.display = "block";   
            const list = document.querySelector("#whois-kaitousya");
            const li = document.createElement("li");
            li.innerHTML = `${kaitouSya.name}`;
            list.innerHTML = li.innerHTML + "が回答ボタンを押しました！"       

            var shushut = $("#shutsudaisya-token")

            if(IAM.token == shushut.value)
              {
  
      
          $("#jikangire").style.display = "block";   
          }


        
        
        
            }
          }

          socket.on("re-kaitou-txt-post", (kaitouMsg)=>{



            const klist = document.querySelector("#kotae");
            const kli = document.createElement("kli");
            kli.innerHTML = `${kaitouMsg.text}  `;
            klist.innerHTML = "回答は「" + kli.innerHTML +"」"

            var shushut = $("#shutsudaisya-token")
            $("#kaitou").style.display = "none";  
            $("#jikangire").style.display = "none"; 


            var shushut = $("#shutsudaisya-token")

            if(IAM.token == shushut.value)
                {
    
        
            $("#seikai-hantei").style.display = "block";   
            }
        }

            )

            $("#seikai-button").addEventListener('submit',  (e)=> {
                e.preventDefault();

                socket.emit("seikai-desu", {  });
            })

            socket.on("seikai-desune", ()=>{

                popMsg("正解！")

                $("#kaitou-pop").style.display = "none";  
                $("#seikai-hantei").style.display = "none";  
                $("#stop-hayaoshi-mondai").style.display = "none";

                const outputBox = document.getElementById("kaitousya-token");
                outputBox.value = "";

                var shushut = $("#shutsudaisya-token")
                if(IAM.token == shushut.value)
                    {
            
                $("#shutsudai").style.display = "block";   
                }else{
                    $("#taiki").style.display = "block";  


                }

            });

            $("#machigai-button").addEventListener('submit',  (e)=> {
                e.preventDefault();

                socket.emit("machigai-desu", {  });
            })

            socket.on("machigai-desune", ()=>{

                popMsg("間違い！")

                $("#kaitou-pop").style.display = "none";  
                $("#seikai-hantei").style.display = "none";  
                $("#hayaoshi-mondai").style.display = "block";
                $("#stop-hayaoshi-mondai").style.display = "none";
                
    
    

                var shushut = $("#shutsudaisya-token")
                var kaitoka = $("#kaitousya-token")
                if(IAM.token == shushut.value)
                    {           
                }else if (IAM.token == kaitoka.value){
                    
                } else {
                    $("#hayaoshi-button").style.display = "block";  
                }

                const zenzen = $("#hide-zenbun")
                const stoplist = document.querySelector("#hide-mondaibun");

                var saikai = stoplist.value

                var zshutsudaiMsg = zenzen.value

                addMessage(zshutsudaiMsg, saikai.length);



            })

            $("#jikangire-button").addEventListener('submit',  (e)=> {
              e.preventDefault();

              socket.emit("jikangire-desu", {  });
          })

          socket.on("jikangire-desune", ()=>{

              popMsg("時間切れ！")

              $("#kaitou-pop").style.display = "none";  
              $("#seikai-hantei").style.display = "none";  
              $("#hayaoshi-mondai").style.display = "block";
              $("#stop-hayaoshi-mondai").style.display = "none";
              $("#jikangire").style.display = "none";   
              $("#kaitou").style.display = "none";  
              $("#next").style.display = "block";

  
  

              var shushut = $("#shutsudaisya-token")
              var kaitoka = $("#kaitousya-token")
              if(IAM.token == shushut.value)
                  {           
              }else if (IAM.token == kaitoka.value){
                  
              } else {
                  $("#hayaoshi-button").style.display = "block";  
              }

              const zenzen = $("#hide-zenbun")
              const stoplist = document.querySelector("#hide-mondaibun");

              var saikai = stoplist.value

              var zshutsudaiMsg = zenzen.value

              addMessage(zshutsudaiMsg, saikai.length);



          })

          $("#next-button").addEventListener('submit',  (e)=> {
            e.preventDefault();

            socket.emit("next-desu", {  });
        })

        socket.on("next-desune", ()=>{

          $("#hayaoshi-button").style.display = "none";   

            popMsg("正解者なし")

 
            $("#hayaoshi-mondai").style.display ="none";
            $("#next").style.display = "none";   
            $("#kaitou").style.display = "none";  




            const outputBox = document.getElementById("kaitousya-token");
            outputBox.value = "";

            var shushut = $("#shutsudaisya-token")
            if(IAM.token == shushut.value)
                {
        
            $("#shutsudai").style.display = "block";   
            }else{
                $("#taiki").style.display = "block";  


            }



        })
            
            function popMsg(msg) {              
                $("#pop-sec").style.display =  "block";
              
               
              
              document.getElementById("pop").innerHTML = msg            

var hide = function(){
    $("#pop-sec").style.display = "none";         
}       
    setTimeout(hide, 3000); 
  
}
   
  

                  



            