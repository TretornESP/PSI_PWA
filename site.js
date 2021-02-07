
      const url = 'https://musicbrainz.org/ws/2/artist/?query=artist:equilibrium&fmt=json';
      var online = true;

      function createNode(element) {
        return document.createElement(element);
      }


      function append(parent, el) {
        return parent.appendChild(el);
      }

      function changeLanguage(language) {
          var element = document.getElementById("url");
          element.value = language;
          element.innerHTML = language;
      }

      function showDropdown() {
          document.getElementById("myDropdown").classList.toggle("show");
      }

      function toggleId() {
        var divsToHide = document.getElementsByClassName("datatab");
        var visib;
        if (document.getElementById("show_id").checked) {
          console.log("Showing");
          visib = "visible";
          window.localStorage.setItem('show_id', '1');
        } else {
          console.log("hiding");
          visib = "collapse";
          window.localStorage.setItem('show_id', '0');
        }
        divsToHide.style.visibility = visib;
      }

      function ffetchQuery() {
        console.log("EXEC: ");
        const ul = document.getElementById('datatab');
        fetch (url)
        .then((resp) => resp.json())
        .then(function(data) {
          let artists = data.artists;
            return artists.map(function(artist) {
              let li = createNode('li');
              let id = createNode('span');
              let name = createNode('span');
              id.innerHTML = `${artist.id}`;
              id.classList.add("id");
              name.innerHTML = `${artist.name}`;
              append(li, id);
              append(li, name);
              append(ul, li);
            })
        }).catch(function(error) {
          console.log(error);
        });
      }

      function checkermod(data) {
        document.getElementById("show_id").checked = data;
      }

      // Close the dropdown if the user clicks outside of it
      window.onclick = function(event) {
          if (!event.target.matches('.dropbtn')) {
              var dropdowns = document.getElementsByClassName("dropdown-content");
              var i;
              for (i = 0; i < dropdowns.length; i++) {
                  var openDropdown = dropdowns[i];
                  if (openDropdown.classList.contains('show')) {
                      openDropdown.classList.remove('show');
                  }
              }
          }
      }

      window.addEventListener('load', function () {
        console.log("CUAK");
        if (online) {
          console.log(window.localStorage.getItem('show_id'));
          if (window.localStorage.getItem('show_id') === "0") {
            document.getElementById("show_id").checked = false;
            console.log("unchecking");
            toggleId();
          }
          ffetchQuery();
        } else {
          console.log("OFFLINE");
          //Cache thinge
        }
      });
