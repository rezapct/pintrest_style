var Pintrest = Pintrest || {};
var offset = 0;

Pintrest.init = async function () {
  Pintrest.CallAPI();
  Pintrest.ScrollLOadMore();

  window.addEventListener("resize", Pintrest.resizeAllGridItems);
};

Pintrest.ScrollLOadMore = function () {
  window.onscroll = function (ev) {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Number(document.getElementById("products").getAttribute("offset")) ===
        offset
    ) {
      offset =
        Number(document.getElementById("products").getAttribute("offset")) + 1;
      Pintrest.CallAPI(offset);
    }
  };
};

Pintrest.CallAPI = function () {
  if (document.contains(document.getElementById("messageError"))) {
    document.getElementById("messageError").remove();
  }

  document.getElementById("snippet").style.display = "flex";

  axios
    .get("http://xoosha.com/ws/1/test.php?offset=" + offset)
    .then(
      (response) => {
        var result = response.data;

        for (let i = 0; i < result.length; i++) {
          var iDiv = document.createElement("div");
          iDiv.className = "productItem";

          var contentDiv = document.createElement("div");
          contentDiv.className = "productContent";

          var innerDiv = document.createElement("div");
          innerDiv.className = "imageBox";
          contentDiv.appendChild(innerDiv);

          var image = document.createElement("img");
          image.src = result[i].image_url;
          image.alt = result[i].name;
          innerDiv.appendChild(image);

          var span = document.createElement("span");
          span.innerHTML = result[i].domain;
          innerDiv.appendChild(span);

          var link = document.createElement("a");
          link.href = result[i].canonical_url;
          link.target = "_blank";
          link.innerHTML = "Open";
          innerDiv.appendChild(link);

		  const tags = result[i].tags.split(",");
          if (tags.length > 0) {
            var divOuterTags = document.createElement("div");
            divOuterTags.className = "outerTags";
            contentDiv.appendChild(divOuterTags);

            var divTags = document.createElement("div");
            divTags.className = "tags";
            divOuterTags.appendChild(divTags);

            for (let i = 0; i < tags.length; i++) {
              var tag = document.createElement("span");
              tag.innerHTML = tags[i];
              divTags.appendChild(tag);
            }
          }

          var title = document.createElement("h2");
          title.innerHTML = result[i].name;
          contentDiv.appendChild(title);

          var price = document.createElement("span");
          price.innerHTML = result[i].price;
          title.appendChild(price);

          var description = document.createElement("p");
          description.innerHTML = result[i].description;
          contentDiv.appendChild(description);

          iDiv.appendChild(contentDiv);

          document.getElementById("products").appendChild(iDiv);
          document.getElementById("products").setAttribute("offset", offset);

          Pintrest.resizeAllGridItems();
        }

        document.getElementById("snippet").style.display = "none";
		Pintrest.resizeAllGridItems();
      }
    )
	.catch(err =>{
		console.log(err)
		if (document.contains(document.getElementById("messageError"))) {
			document.getElementById("messageError").remove();
		  }

		document.getElementById("snippet").style.display = "none";
        var iDiv = document.createElement("div");
        iDiv.setAttribute("id", "messageError");

        var description = document.createElement("p");
        description.innerHTML =  "Couldn't call API, Please click here to try again";
        iDiv.appendChild(description);
    

        var div = document.getElementById("products");
        div.parentNode.insertBefore(iDiv, div.nextSibling);
	})
};

Pintrest.resizeGridItem = function (item) {
  var grid = document.getElementsByClassName("grid_products")[0];
  var rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  );
  var rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  );
  var rowSpan = Math.ceil(
    (item.querySelector(".productContent").getBoundingClientRect().height +
      rowGap) /
      (rowHeight + rowGap)
  );

  item.style.gridRowEnd = "span " + rowSpan;
};

Pintrest.resizeAllGridItems = function () {
  var allItems = document.getElementsByClassName("productItem");
  for (x = 0; x < allItems.length; x++) {
    Pintrest.resizeGridItem(allItems[x]);
  }
};

Pintrest.openMenu = function () {
  let drpElement = document.getElementById("dropDownMenu");
  
  if (drpElement.classList.contains('open')) {
    drpElement.classList.remove("open");
	document.getElementsByClassName("overly")[0].classList.remove("show");
  } else {
    drpElement.classList.add("open");
	document.getElementsByClassName("overly")[0].classList.add("show");
  }
};
