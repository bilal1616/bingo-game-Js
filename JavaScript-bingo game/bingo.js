/* bir bilet tüm numaralarla eşleştiğinde gerçek olur */
let gameOver = false;

/* 15 sayıdan oluşan bir array'in ve bir durumun saklanacağı biletin seçilip seçilmediğini kontrol etmek için
(2. aşamaya geçmek için) */
const ticketsStatus = [];

/* seçilen bilet sayısını kontrol eder */
let ticketSelected = 0;

/* herhangi bir sayı olabilir */
let ticketSerial = 0000001;

/* bir biletin 15 rastgele sayısını oluştururken kullanılacak */
let max = 90;

/* 1. aşamada seçilen 3 bileti saklar */
const humanTickets = [];

/* kalan 12 bileti saklar */
const computerTickets = [];

/* seçilen biletler + bilgisayar biletleri, sonunda bu preTicketsArray'in yapısı
   olacak: [[3{status,catched,ticket[15]}],[12{status,catched,ticket[]}]]*/
const analyzedTickets = [];


/* 1. aşamada seçili biletleri azaltır */
function reduceTikcet(){
  if(ticketSelected>0){
    ticketSelected--;
  }
}

/* 1. aşamada, bilet seçimli sayacı artırır */
function increaseTicket(){
  if(ticketSelected<3){
    ticketSelected++;
  }
}

/* 90 öğelik bir array oluşturur, her biri 1 ile 90 arasında bir sayıdır */
function createNumbers(){
  const numbers = [];
  for(let a=1; a<91; a++){
    numbers.push(a);
  }
  return numbers;
}

/* 1 ile 90 arasında 15 farklı sayıdan oluşan bir array oluşturur */
const generateTicket = function(){
  let max = 90;
  const ticket =[];
  const numbers = createNumbers();
  for(let a=0; a<15; a++){
    const mid = Math.floor(Math.random() * max);
    ticket.push(numbers[mid]);
    max--;
    numbers.splice(mid,1);
  }
  ticket.sort((a,b) => (a-b));
  return ticket;
};

/* 2. aşama için 1'den 90'a kadar bir sayı array'i oluşturur
  çekilen sayılar için bir havuz olarak kullanılmak üzere */
const extractionsArray = createNumbers();

/* 15 nesnelik bir array oluşturur ve ilgili dom öğelerini oluşturur */
function generateTicketsPre(target){
  for(let a=0; a<15; a++){
    const element = {};
    element.ticket = generateTicket();
    element.status = false;
    element.serial = ticketSerial;
    /* 2. aşamada, bilet bir sayıyla her eşleştiğinde artar */
    element.catched = 0;
    ticketSerial++;
    ticketsStatus.push(element);

    const ticket= document.createElement('div');
    ticket.classList.add('ticket');

    const ticketHeader = document.createElement('div');
    ticketHeader.classList.add('ticket-header');
    ticketHeader.innerText = 'Ticket serial:  ' + ticketsStatus[a].serial;

    const ticketBody = document.createElement('div');
    ticketBody.classList.add('ticket-body');

    for(let b=0; b<15; b++){
      const ticketNumber = document.createElement('div');
      ticketNumber.classList.add('ticket-number');
      ticketNumber.innerText = ticketsStatus[a].ticket[b];
      ticketBody.appendChild(ticketNumber);
    }

    ticket.appendChild(ticketHeader);
    ticket.appendChild(ticketBody);

    target.appendChild(ticket);
  }
}


/* 2. aşama, oyuncu ve bilgisayar biletleri için dom öğelerini oluşturur */
function generatePlayTicket(index,condition,array){
  const ticket = document.createElement('div');
  condition ? ticket.classList.add('human-ticket') : ticket.classList.add('computer-ticket');

  const header = document.createElement('div');
  header.classList.add('header');
  header.innerText = 'Ticket serial: ' + array[index].serial;

  const ticketBody = document.createElement('div');
  ticketBody.classList.add('ticket-body');

  for(let a=0; a<15; a++){
    const ticketNumber = document.createElement('div');
    ticketNumber.classList.add('ticket-number');
    ticketNumber.innerText = array[index].ticket[a];

    ticketBody.appendChild(ticketNumber);
  }

  ticket.appendChild(header);
  ticket.appendChild(ticketBody);

  return ticket;
}

document.addEventListener('DOMContentLoaded', function() {

  /* 1. aşamada biletleri içeren dom öğesi */
  const ticketsContainer = document.querySelector('.tickets-container');

  /* 1. aşamada 3 bilet seçerseniz tıklanabilir */
  const activator = document.querySelector('.activator');

  /* 1. aşama için dom gövdesi */
  const preGame = document.querySelector('.pre-game');

  /* faz 2 için dom gövdesi */
  const game = document.querySelector('.game');

  /* ilgili biletlerin container'ı */
  const humanTicketsContainer = document.querySelector('.human-tickets');
  const computerTicketsContainer = document.querySelector('.computer-tickets');

  /* her bir ekstraksiyonun kaydedildiği faz 2'deki dom container'ı */
  const extractedNumbers = document.querySelector('.extracted-numbers');

  /* çıkarılan yeni numaranın dom container'ı */
  const extraction = document.querySelector('.new-extraction');

  /* arraydeki seçili insan bileti + bilgisayar biletleri,
  Bir çıkarmanın kare rengini değiştirmek için gereken eşleşmeler*/
  let analyzedDomTickets;

  /* 2. aşamada, oyunun devam edip etmediğini veya bingo yapılmış bir biletin olup olmadığını gösterir. */
  const annauncer = document.querySelector('.announcer');

  /* yorumlanma */
  generateTicketsPre(ticketsContainer);

  /* 1. aşamada dom biletleri */
  const preTicketsArray = document.querySelectorAll('.ticket');

  /* Faz 1 biletleri tıklanabilir hale gelir, en fazla 3 adet seçebilirsiniz,
     ayrıca seçimi kaldırabilirsiniz */
  function activateSelection(){
    for(let a=0; a<preTicketsArray.length; a++){
      preTicketsArray[a].addEventListener('click', function(){
        if(ticketsStatus[a].status === true){
          preTicketsArray[a].classList.remove('selected');
          ticketsStatus[a].status = false;
          reduceTikcet();
        } else {
          if(ticketSelected<1){
            ticketsStatus[a].status = true;
            preTicketsArray[a].classList.add('selected');
            increaseTicket();
          }
        }
        /* 3 bilet seçtiyseniz 2. aşamaya geçebilirsiniz. */
        ticketSelected === 1 ? activator.classList.remove('hide-activator') : activator.classList.add('hide-activator');
      });
    }
  }
  activateSelection();

  /* ilgili biletleri container'a ekler */
  function assignPlayTickets(){
    for (let a=0; a<15; a++){
      const domTicket = generatePlayTicket(a,ticketsStatus[a].status,ticketsStatus);
      if (ticketsStatus[a].status) {
        humanTickets.push(ticketsStatus[a]);
        humanTicketsContainer.appendChild(domTicket);
      } else {
        computerTickets.push(ticketsStatus[a]);
        computerTicketsContainer.appendChild(domTicket);
      }
    }
    analyzedTickets.push(humanTickets);
    analyzedTickets.push(computerTickets);
  }

  /* kazanan biletlere farklı stil eklemek için gerekli */
  let domHumanTickets;
  let domComputerTickets;

  /* 2. aşama, herhangi bir biletin şu numarayla eşleşen bir sayı içerip içermediğini kontrol eder:
  çekilen sayı, if'se biletin yakalama sayacını artırır,
  yakalama sayacı 15'e ulaşırsa, gameOver boolean'a geçiş yapar*/
  function scanTicket(a,b,extracted){
    for(let c=0; c<15; c++){
      if(extracted === parseInt(analyzedDomTickets[a][b][c].innerText)){

        analyzedDomTickets[a][b][c].classList.add('catched');
        analyzedTickets[a][b].catched++;

        if(analyzedTickets[a][b].catched===15){
          gameOver = true;
          annauncer.innerText = 'TOMBALA!!';
          for(let y=0;y<15;y++){
            analyzedDomTickets[a][b][y].classList.remove('catched');
            a === 0 ? analyzedDomTickets[a][b][y].classList.add('winning-human') :
              analyzedDomTickets[a][b][y].classList.add('winning-computer');
          }
        }
      }
    }
  }

  /* bilet taramasını belirli bir bilet array(dizisine) uygular*/
  function scanTicketsArray(array, extracted){
    for(let a=0; a<array.length; a++){
      for(let b=0; b<array[a].length; b++){
        scanTicket(a,b,extracted);
      }
    }
  }

  /* 2. aşamanın ana işlevi, oyunu yürütür */
  function bingo(array){
    const extractedIndex = Math.floor(Math.random() * max);
    const extracted = extractionsArray[extractedIndex];

    extraction.innerText = extracted;

    const domExtracted = document.createElement('div');
    domExtracted.classList.add('extracted-number');
    domExtracted.innerText = extracted;

    extractedNumbers.appendChild(domExtracted);

    scanTicketsArray(array,extracted);

    extractionsArray.splice(extractedIndex,1);
    max--;
  }

  /* tıklanırsa faz 1'den faz 2'ye geçer.
      2. aşamanın işlevleri çağrılacak */
  activator.addEventListener('click', function(){
    assignPlayTickets();
    preGame.style.visibility = 'hidden';
    game.style.visibility = 'visible';

    /* her biletin sayı container'larının dizisi */
    domHumanTickets = document.querySelectorAll('.human-ticket .ticket-body');
    domComputerTickets = document.querySelectorAll('.computer-ticket .ticket-body');

    /*bir sayı container'a verildiğinde, container içindeki sayıların bir dizisini oluşturur */
    function assignDom(array){
      const result = [];
      for(let a=0; a<array.length; a++){
        result.push(array[a].children);
      }
      return result;
    }

    /* her sayı için kapsayıcı assignDom'u yürütür */
    function assignDomNumbers(a,b){
      const result =[];
      result.push(assignDom(a));
      result.push(assignDom(b));
      return result;
    }

    /* [[3[15]],[12[15]] 26. satıra benzer şekilde yapılandırılacak olan budur */
    analyzedDomTickets = assignDomNumbers(domHumanTickets,domComputerTickets);

    /*bir bilet tombala yapana kadar her 1.5 saniyede bir sayı çıkarır */
    const runGame = function(){
      const interval = setInterval(function() {
        bingo(analyzedDomTickets);
        if (gameOver) clearInterval(interval);
      }, 1500);
      return interval;
    };

    /* extractions başlamasını 1.5 saniye geciktirme*/
    setTimeout(function() {
      runGame();
    }, 1500);

  });

});
