console.log("Script Running");

const searchButton = document.querySelector("#searchButton");
const searchInputBox = document.querySelector("#searchInputBox");
const dropdownContent = document.querySelector("#dropdownContent");
const eventsContainer = document.querySelector("#contain");
const checkboxDiv = document.querySelector("#checkbox-filter");
//filter with checkbox

//Api Call
//TicketMaster Api //
const apikey = "tpxoPBXOnYCMwo7gLEnh2gVd81undJGG";

// Constant URL value for JAAS API
const Ticket_master_API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}`;

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let selectedCategories = new Set();
checkboxes.forEach(box => {
  box.addEventListener('click', (e) => {
    if (box.checked) {
      selectedCategories.add(box.getAttribute("id"));
    }
    else {
      selectedCategories.delete(box.getAttribute("id"));
    }
    updateEvents();
  });
});

const eventsBox = document.querySelector("#events");
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//Search Results//
const getResultByLocation = async () => {
  let dataArr = [];
  let location = searchInputBox.value.toLowerCase();

  const musicResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?dmaId=${idMap.get(location)}&classificationName=music&size=5&apikey=${apikey}`);
  const musicData = await musicResponse.json();
  dataArr.push(musicData);

  const sportsResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?dmaId=${idMap.get(location)}&classificationName=sports&size=5&apikey=${apikey}`);
  const sportsData = await sportsResponse.json();
  dataArr.push(sportsData);

  const artsResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?dmaId=${idMap.get(location)}&classificationName=arts&size=5&apikey=${apikey}`);
  const artsData = await artsResponse.json();
  dataArr.push(artsData);

  const miscResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?dmaId=${idMap.get(location)}&classificationName=miscellaneous&size=5&apikey=${apikey}`);
  const miscData = await miscResponse.json();
  dataArr.push(miscData);

  /* const familyResponse = https://app.ticketmaster.com/discovery/v2/events.json?classificationName=family &dmaId=${idMap.get(location)}&apikey=${apikey}*/
  dataArr.forEach(data => {
    console.log(data);
    events = (data["_embedded"])["events"];
    console.log(events);

    events.forEach(event => {
      let eventName = event["name"];
      let eventCategory = event["classifications"][0]["segment"]["name"];
      let date = new Date(event["dates"]["start"]["localDate"]);
      let eventDate = date.toLocaleDateString("en-US", options);
      //put in event image
      let eventImage = event["images"][0]["url"];
      let eventLocation = event["_embedded"]["venues"][0]["name"] + ", " + event["_embedded"]["venues"][0]["city"]["name"] + ", " + event["_embedded"]["venues"][0]["state"]["name"];

      let eventLink = event["url"];

      let category = "";
      if (eventCategory === "Arts & Theatre") {
        category = "arts"
      }
      else {
        category = eventCategory.toLowerCase();
      }

      eventsBox.innerHTML += `<div a class="list-group-item ${category}">
                <h4 id = "list-group-item-heading" class="list-group-item-heading"><a href="${eventLink}" target="_blank" style="color:#328b80; font-size: 20px;">${eventName}</a></h4>
                <p class="list-group-item-text"> ${eventDate}</p>
                <p class="list-group-item-text"> ${eventCategory}</p>
                <p class="venue">${eventLocation}</p>
                <img style = "width: 20%; height = auto; display: inline;" src="${eventImage}" alt="placeholder image">
                </br>
               <button onclick="saveEventFunc('${eventName}','${eventDate}','${eventCategory}','${eventLocation}','${eventLink}',this);" class="saveEvent">Save event</button>
              </a><\div>`;
    });
  });
  updateEvents();
  eventsContainer.classList.remove("hidden");
  let yval = eventsContainer.offsetTop;
  window.scroll({
    top: yval,
    behavior: 'smooth'
  });

}

const updateEvents = () => {
  //let allEvents = eventsBox.querySelectorAll("a");
  let allEvents = eventsBox.querySelectorAll(".list-group-item");
  console.log("events are updated")
  allEvents.forEach(event => {
    let currentCategory = event.classList[1];
    if (selectedCategories.size === 0) {
      event.classList.remove("hidden");
      console.log("none selected");
    }
    else {
      if (selectedCategories.has(currentCategory)) {
        event.classList.remove("hidden");
        console.log("Selected Category: " + currentCategory);
      }
      else {
        event.classList.add("hidden");
        console.log("Unselected Category:" + currentCategory);
      }
    }
  });
}

searchButton.addEventListener("click", (e) => {
  //test code
  if (searchInputBox.value == "") {
    alert("Please choose a city");
  }
  //test code
  eventsBox.innerHTML = "";
  checkboxDiv.classList.remove("hidden");
  getResultByLocation();
});

//event list items!
// Put in <div id="events" class="list-group">
/*<a href="#" class="list-group-item">
<h4 class="list-group-item-heading">Event title</h4>
<p class="list-group-item-text">Event description</p>
<p class="venue"></p>
</a>*/

const calendarButton = document.querySelector("#calendarBttn");

/*
$(document).ready(function() {
   // This is where our code will go
  const firebaseConfig = {
    apiKey: "AIzaSyA3oIgT3uyqYXp0ISRy3YvsnEadcaVLBYQ",
    authDomain: "eventure-890d1.firebaseapp.com",
    databaseURL: "https://eventure-890d1-default-rtdb.firebaseio.com",
    projectId: "eventure-890d1",
    storageBucket: "eventure-890d1.appspot.com",
    messagingSenderId: "296037258595",
    appId: "1:296037258595:web:19870daffd39a4b7732f56",
    measurementId: "G-9S71HGC1S6"
  };
});*/


/*(function($) {
    var registerListeners = function() {
        $("." + this.settings.filter_class).on("click", $.proxy(doFilter, this));
    };

    var doFilter = function() {
        var filter_definitions = {};
        var element = this;
        $(element).find('.' + this.settings.filter_class).each(function(i) {
            var filter = $(this);
            if (filter.prop("checked")) {
                var attribute = filter.data(element.settings.attribute_name);
                var value = filter.data(element.settings.value_name);
                var group = filter.data(element.settings.group_name);
                var filter_string = "[data-" + attribute + "~='" + value + "']";
                if (typeof filter_definitions[group] === "undefined") {
                    filter_definitions[group] = filter_string;
                } else {
                    filter_definitions[group] += ", " + filter_string;
                }
            }
        });
        var all = $(element).find('.' + element.settings.filterable_class);
        $.each(filter_definitions, function(k, v) {
            all = $(all).filter(v);
        });

        $(element).find("." + element.settings.filterable_class).removeClass(element.settings.toggle_class_matched);
        $(element).find("." + element.settings.filterable_class).addClass(element.settings.toggle_class_nomatched);

        $(all).removeClass(element.settings.toggle_class_nomatched);
        $(all).addClass(element.settings.toggle_class_matched);
        $(element).find("#" + element.settings.debug_element_id).html(JSON.stringify(filter_definitions));
    }

    $.fn.demano = function(config) {
        var defaults = {
            filter_class: "filter",
            filterable_class: "filterable",
            attribute_name: "attribute",
            value_name: "value",
            group_name: "group",
            toggle_class_matched: "on",
            toggle_class_nomatched: "off",
            debug_element_id: null,
        };

        this.settings = $.extend(defaults, config);
        $.proxy(registerListeners, this)();
        $.proxy(doFilter, this)();
        return this;
    };
});*/




const saveEventFunc = (name, date, category, location, link, button) => {

  if (button.classList.contains("clicked")) {
    alert("This event has already been saved");
  }
  else {
    const newObj = {
      "name": name,
      "date": date,
      "category": category,
      "location": location,
      "link": link
    };
    let currJSON = window.localStorage.getItem("data");
    if (currJSON === null) {
      let obj = {
        "arr": [],
      }
      obj.arr.push(newObj);
      window.localStorage.setItem("data", JSON.stringify(obj));
    }
    else {
      let currObj = JSON.parse(currJSON);
      let array = currObj.arr;
      array.push(newObj);
      let lastObj = JSON.stringify(currObj);
      window.localStorage.setItem("data", lastObj)
    }
    button.classList.add("clicked");
    button.innerHTML = "Event Saved";
    alert("Event Saved!");
  }
}

//<script>
  //$("#calendar").evoCalendar();
//</script>
 const updateSaveEvents = () => {
  const panel = document.querySelector("#savedEventsList");
  events = window.localStorage.getItem("data");
  if (events) {
    eventsList = JSON.parse(events).arr;
    panel.innerHTML ="";
    for(let i=0; i<eventsList.length; i++) {
      let event = eventsList[i];
    let eventCategory = event.category;
    let category = "";
      if (eventCategory === "Arts & Theatre") {
        category = "arts"
      }
      else {
        category = eventCategory.toLowerCase();
      }

      let eventLink = event.link;
      let eventName = event.name;
      let eventDate = event.date;
      let eventLocation = event.location;
      
     panel.innerHTML+=`<div a class="list-group-item ${category}">
                <h4 id = "list-group-item-heading" class="list-group-item-heading"><a href="${eventLink}" target="_blank" style="color:#328b80; font-size: 20px;">${eventName}</a></h4>
                <p class="list-group-item-text"> ${eventDate}</p>
                <p class="list-group-item-text"> ${eventCategory}</p>
                <p class="venue">${eventLocation}</p>
                </br>
               <button class="removeEvent" onclick="removeEventFunc('${eventName}','${eventDate}','${eventCategory}','${eventLocation}','${eventLink}')>Remove event</button>
              </a><\div>`;
    }
  }
  else {
    return;
  }
};

