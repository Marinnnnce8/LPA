/**
 * Theme JS
 *
 * @copyright 2019 NB Communication Ltd
 *
 */

var $nb = NB.util;
var $uk = UIkit.util;
var navTarget = document.getElementsByClassName("uk-navbar-dropdown")[0];
var overlay = document.getElementsByClassName("js-overlay")[0];
var isOverlayOpen = false;
var loadMoreBtn = document.getElementsByClassName("js-load-more")[0];

var theme = {
  init: function() {
    this.ga();
    this.blocks();
  },

  ga: function() {
    var el = $nb.$("ga", "[data]");
    if (!el) return;

    var data = $nb.data(el, "ga");
    if (!$uk.isObject(data)) return;
    if (!$uk.isObject(data.options)) data.options = {};

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", data.id, data.options);
  },

  blocks: function() {
    var clsTable = ["uk-table", "uk-table-justify"];
    var alignments = ["left", "right", "center"];
    var fileIcons = {
      pdf: ["pdf"],
      word: ["doc", "docx"],
      excel: ["xls", "xlsx"],
      powerpoint: ["ppt", "pptx"],
      archive: ["zip", "tar"]
    };

    $nb.$$("nb-block").forEach(function(block) {
      switch ($uk.data(block, "nb-block")) {
        case "content":
          // Apply UIkit table classes
          $uk.$$("table", block).forEach(function(el) {
            $uk.addClass(el, clsTable);
            $uk.wrapAll(el, "<div class='uk-overflow-auto'>");
          });

          // Inline Images UIkit Lightbox/Scrollspy
          $uk
            .$$("a[href]", block)
            .filter(function(a) {
              return $uk.attr(a, "href").match(/\.(jpg|jpeg|png|gif|webp)/i);
            })
            .forEach(function(a) {
              var figure = a.parentNode;
              var caption = $uk.$("figcaption", figure);

              // uk-lightbox
              UIkit.lightbox(figure, { animation: "fade" });
              if (caption) $uk.attr(a, "data-caption", $uk.html(caption));

              // uk-scrollspy
              for (var i = 0; i < alignments.length; i++) {
                var align = alignments[i];
                if ($uk.hasClass(figure, "align_" + align)) {
                  UIkit.scrollspy(figure, {
                    cls:
                      "uk-animation-slide-" +
                      (align == "center" ? "bottom" : align) +
                      "-small"
                  });
                }
              }
            });

          // UIkit File Icons
          for (var key in fileIcons) {
            var value = fileIcons[key];
            for (var i = 0; i < value.length; i++) {
              var links = $uk.$$(
                "a[href$='." +
                  value[i] +
                  "']:not(.nb-file-icon):not(.nb-no-icon)",
                block
              );
              if (links.length) {
                links.forEach(function(el) {
                  $uk.prepend(
                    el,
                    $nb.ukIcon(
                      key == "pdf"
                        ? "file-pdf"
                        : key == "archive"
                        ? "album"
                        : "file-text"
                    )
                  );
                  $uk.addClass(el, "nb-file-icon nb-file-icon-" + key);
                });
              }
            }
          }

          break;
        case "embed":
          $uk.$$("iframe", block).forEach(function(el) {
            $uk.attr(el, "data-uk-responsive", true);
          });

          UIkit.update();

          break;
      }
    });
  }
};

$uk.ready(function() {
  theme.init();
});

/**
 * jsonRender
 *
 * @param {Array} items
 * @param {Object} config
 * @return {string}
 *
 */
function renderItems(items, config) {
  var out = "";
  var classes = ["uk-grid-match", "uk-child-width-1-2@s"];
  var sizes = $nb.ukWidths(classes);

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    var title = $nb.wrap(
      $nb.wrap(
        item.title,
        {
          href: item.url,
          class: "uk-link-reset"
        },
        "a"
      ),
      { class: ["uk-card-title", "uk-margin-remove-bottom"] },
      "h3"
    );

    var image = item.getImage
      ? $nb.img(
          item.getImage,
          {
            alt: item.title,
            sizes: sizes.length ? sizes.join(", ") : false
          },
          {
            "uk-img": { target: "!* +*" }
          }
        )
      : "";

    var summary = item.getSummary ? $nb.wrap(item.getSummary, "p") : "";

    var more = $nb.wrap(
      config.more ? config.more : $nb.ukIcon("more"),
      {
        href: item.url,
        class: ["uk-button", "uk-button-text"]
      },
      "a"
    );

    out += $nb.wrap(
      $nb.wrap(
        (image
          ? $nb.wrap(
              $nb.wrap(image, { href: item.url }, "a"),
              "uk-card-media-top"
            )
          : "") +
          $nb.wrap(
            title +
              (item.date_pub ? $nb.wrap(item.date_pub, "uk-text-meta") : "") +
              (item.dates ? $nb.wrap(item.dates, "uk-text-meta") : "") +
              (item.location ? $nb.wrap(item.location, "uk-text-meta") : ""),
            "uk-card-header"
          ) +
          (summary ? $nb.wrap(summary, "uk-card-body") : "") +
          $nb.wrap(more, "uk-card-footer"),

        "uk-card uk-card-default"
      ),
      "div"
    );
  }

  return $nb.wrap(
    out,
    {
      class: classes,
      "data-uk-grid": true,
      "data-uk-scrollspy": {
        target: "> div",
        cls: "uk-animation-slide-bottom-small",
        delay: NB.options.speed
      }
    },
    "div"
  );
}

function toggleOverlay() {
  isOverlayOpen = !isOverlayOpen;
  overlay.style.display === "none" || overlay.style.display === ""
    ? (overlay.style.display = "block")
    : (overlay.style.display = "none");
}

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("overlay-dropdown")) {
    if (!isOverlayOpen) {
      toggleOverlay();
      return;
    }
    if (isOverlayOpen && !e.target.classList.contains("uk-open")) {
      toggleOverlay();
      return;
    }
  }
  if (e.target.classList.contains("overlay-link")) {
    if (isOverlayOpen) {
      toggleOverlay();
    }
  }
});

function removeRel() {
  var enableLink = document.getElementsByClassName("js-enable-link");
  for (var i = 0; i < enableLink.length; i++) {
    enableLink[i].removeAttribute("rel");
    enableLink[i].addEventListener("click", function() {
      var linkUrl = this.getAttribute("href");
      location.href = linkUrl;
    });
  }
}
if (document.getElementsByClassName("js-enable-link").length) {
  window.addEventListener("load", function() {
    removeRel();
  });
}

function waveTitleHeight() {
  var waveBoxes = document.getElementsByClassName("wave-box");
  var addedHeight = 10;
  for (var i = 0; i < waveBoxes.length; i++) {
    textHeight =
      document.getElementsByClassName("wave-text")[i].offsetHeight +
      addedHeight;
    document.getElementsByClassName("uk-card-body")[i].style.bottom =
      -textHeight + "px";
  }
}

window.addEventListener("load", function() {
  if (document.getElementsByClassName("wave-box").length) {
    waveTitleHeight();
  }
});

if (document.getElementsByClassName("wave-box").length) {
  loadMoreBtn.addEventListener("click", function() {
    var waveBox = document.getElementsByClassName("wave-box");
    var number = 0;
    for (var i = 0; i < waveBox.length; i++) {
      var compStyles = window.getComputedStyle(waveBox[i]);
      if (compStyles.getPropertyValue("display") === "none" && number < 3) {
        waveBox[i].style.display = "flex";
        number++;
      }
    }
    waveTitleHeight();
  });
}

if (document.getElementsByClassName("btn-down").length) {
  var btnDown = document.getElementsByClassName("btn-down")[0];
  var secTo = document.getElementsByClassName("js-scroll-to")[0];
  btnDown.addEventListener("click", function() {
    var top = secTo.offsetTop;

    window.scrollTo(0, top);
  });
}
