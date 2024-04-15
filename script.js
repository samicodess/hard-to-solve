"use strict";
/*

use awd/arrow keys for movement and space for shooting or use touch...
most featured are designed for mobile/touch devices


 108 -  159:    Animation template
 166 -  219:    Game loop
 257 -  272:    Toast messages
 275 -  299:    Coin display
 302 -  317:    Info display
 320 -  488:    Stats
 494 -  691:    Shop
 717 -  788:    Sprite class
 801 -  925:    Mage class
 932 -  976:    Enemy class
 988 - 1020:    Projectile class
1035 - 1053:    Coin class
1059 - 1164:    Map class
1175 - 1441:    Minimap class
1462 - 1626:    Controls class
1647 - 1789:    DOM Element class
1814 - 1828:    Interval class
1833 - 1911:    Class functions
1945 - 1960:    Camera focus
1964 - 2007:    Block effects
2012 - 2090:    Mage - Block collision
2097 - 2115:    Mage - Coin collision
2122 - 2174:    Projectile collision
2178 - 2196:    Enemy collision
2255 - 2302:    Keyboard controls
2309 - 2405:    Map initialization
2416 - 2452:    Level loading
2460 - 2598:    Sprite + Level data
2601 - 2609:    Image slicing



 110 -  113:  [function]   update_fps
 115 -  120:  [function]   init_fps
 122 -  129:  [function]   init_canvas
 132 -  135:  [function]   pull_loop
 137 -  142:  [function]   main
 145 -  147:  [function]   clear
 179 -  198:  [function]   setup
 200 -  208:  [function]   update
 210 -  217:  [function]   draw
 277 -  297:  [function]   create_coin_counter
 378 -  424:  [function]   set_mana
 427 -  473:  [function]   set_health
 475 -  486:  [function]   update_stats
 502 -  547:  [class]      ScrollSelector
 720 -  786:  [class]      Sprite
 754 -  756:  [function]   update
 804 -  920:  [class]      Mage
 825 -  827:  [function]   min
 911 -  914:  [function]   reload
 934 -  969:  [class]      Enemy
 990 - 1015:  [class]      MageBullet
1037 - 1048:  [class]      Coin
1067 - 1162:  [class]      Map
1186 - 1439:  [class]      Minimap
1248 - 1278:  [function]   start
1280 - 1307:  [function]   move
1309 - 1322:  [function]   stop
1348 - 1356:  [function]   detailed_draw
1361 - 1425:  [function]   draw
1464 - 1624:  [class]      Joystick
1473 - 1475:  [function]   apply_design
1478 - 1602:  [function]   setup
1493 - 1602:  [constant]   W
1537 - 1554:  [function]   change_func
1556 - 1584:  [function]   start
1607 - 1616:  [function]   make_draggable
1618 - 1620:  [function]   is_targeted
1649 - 1775:  [class]      Element
1816 - 1826:  [class]      Interval
1835 - 1870:  [function]   spawn_enemies
1872 - 1885:  [function]   spawn_coins
1888 - 1894:  [function]   delete_all_coins
1896 - 1902:  [function]   delete_all_bullets
1904 - 1910:  [function]   delete_all_enemies
1924 - 1926:  [function]   pause
1928 - 1930:  [function]   resume
1934 - 1941:  [function]   equals
1947 - 1958:  [function]   handle_mage_at_screen_edges
1966 - 2004:  [function]   block_collisions
2014 - 2088:  [function]   handle_mage_collisions
2100 - 2113:  [function]   handle_mage_coins_collisions
2124 - 2172:  [function]   handle_bullet_collision
2180 - 2194:  [function]   handle_enemy_collision
2219 - 2223:  [function]   get_index
2226 - 2236:  [function]   get_indices
2238 - 2240:  [function]   choice
2242 - 2247:  [function]   get_id
2264 - 2272:  [function]   handle_keyboard
2275 - 2300:  [function]   add_event_listeners
2311 - 2403:  [function]   init_map
2419 - 2449:  [function]   load_level
2621 - 2622:  [function]   print


*/

// animation template
var update_fps = function () {
  fps.innerHTML = Math.round(1000 / (Date.now() - now));
  now = Date.now();
};

var init_fps = function () {
  fps = document.createElement("a");
  fps.style.color = "lime";
  document.body.appendChild(fps);
  now = Date.now();
};

var init_canvas = function () {
  c = document.getElementById("cvs");
  ctx = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  W = window.innerWidth;
  H = window.innerHeight;
};

var pull_loop = function () {
  main_loop.update();
  requestAnimationFrame(pull_loop);
};

var main = function () {
  update_fps();
  update();
  clear();
  draw();
};

var clear = function () {
  c.width = c.width;
};

window.onload = function () {
  init_fps();
  init_canvas();
  setup();
  main_loop = new Interval(main, 16);
  requestAnimationFrame(main_loop);
  // setInterval(main, 16)
};

// animation template

//game loop
var main_loop, fps, now, c, ctx, W, H;

var map, mage;
var coins = [],
  coin_ref;
var enemies = [];
var mana = 8,
  health = 8;
var joystick_divs;
var use_joystick = true;
var paused = false;
var minimap, joystick;

var setup = () => {
  map = new Map();
  joystick = new Joystick();
  mage = new Mage();

  init_map(map);

  mage.set_cycle(data.mage.idle);
  add_event_listeners();
  coin_ref = create_coin_counter();

  mana_container.show();
  health_container.show();
  questionmark.show();

  update_stats();

  load_level(level);
  minimap = new Minimap(map, minimap_colors);
};

var update = () => {
  //mage.update();
  map.update();
  handle_mage_at_screen_edges();
  handle_mage_collisions();
  handle_mage_coins_collisions();
  handle_bullet_collisions();
  handle_enemy_collisions();
};

var draw = () => {
  map.update_animation();
  map.draw();
  minimap.draw();
  // for(var i in coins) coins[i].draw();
  // for(var i in enemies) enemies[i].draw();
  // for(var i in mage_bullets) mage_bullets[i].draw();
};

//gameloop

var link = "https://i.ibb.co/VxTkPJJ/mage-sprite-8.png";

// toast messages

var toast = new Element({
  background: "grey",
  color: "#fff",
  left: "50%",
  bottom: "10vh",
  position: "absolute",
  transform: "translate(-50%, 0)",
  padding: "5px 10px 5px 10px",
  borderRadius: "5px",
  zIndex: "100",
});

toast.apply_design({
  top: "10vh",
  bottom: "",
});

//toast message

// coin display

var create_coin_counter = function () {
  var div = new Element({
    background: "url(" + link + ")",
    backgroundPosition: "0 -256px",
    backgroundSize: "512px 512px",
    width: "32px",
    height: "32px",
    textAlign: "center",
    lineHeight: "39px",
    color: "#000",
    fontWeight: "bold",
    position: "fixed",
    top: "0",
    right: "0",
  });
  div.text = coin_counter;
  div.show();

  div.add_event_listeners("click", function () {
    shop_container.fade_in();
    shop_container.appendChild(shop_exit);
    shop_exit.show();
    paused();
  });

  return div;
};

// coin display

// info display

var questionmark = new Element({
  background: "url(" + link + ")",
  backgroundPosition: "-288px -256px",
  backgroundSize: "512px 512px",
  width: "32px",
  height: "32px",
  textAlign: "center",
  lineHeight: "39px",
  color: "#000",
  fontWeight: "bold",
  position: "fixed",
  top: "40px",
  right: "0",
});

questionmark.add_event_listeners("click", function () {
  toast.makeToast("Try to defeat all enemies!");
});

// info display

// stats

var mana_container = new Element({
  width: "96px",
  height: "32px",
  position: "fixed",
  right: "40px",
  top: "0",
});

var mana_left = new Element({
  width: "32px",
  height: "32px",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "512px 512px",
});

var mana_middle = new Element({
  width: "32px",
  height: "32px",
  left: "32px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "512px 512px",
});

var mana_right = new Element({
  width: "32px",
  height: "32px",
  left: "64px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "512px 512px",
});

mana_container.appendChild(mana_left);
mana_container.appendChild(mana_middle);
mana_container.appendChild(mana_right);

var health_container = new Element({
  width: "96px",
  height: "32px",
  position: "fixed",
  right: "140px",
  top: "0",
});

var health_left = new Element({
  width: "32px",
  height: "32px",
  left: "32px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "512px 512px",
});

var health_right = new Element({
  width: "32px",
  height: "32px",
  left: "64px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "512px 512px",
});

health_container.appendChild(health_left);
health_container.appendChild(health_middle);
health_container.appendChild(health_right);

var set_mana = function (value /* 0-8*/) {
  if (value === 0) {
    mana_left.div.style.backgroundPosition = "-96px -320px";
    mana_left.div.style.backgroundPosition = "-352px -320px";
    mana_left.div.style.backgroundPosition = "-256px -320px";
  }
  if (value === 1) {
    mana_left.div.style.backgroundPosition = "-64px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-256px -320px";
  }
  if (value === 2) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-256px -320px";
  }
  if (value === 3) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-224px -320px";
  }
  if (value === 4) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-192px -320px";
  }
  if (value === 5) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-160px -320px";
  }
  if (value === 6) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-352px -320px";
    mana_middle.div.style.backgroundPosition = "-128px -320px";
  }
  if (value === 7) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-320px -320px";
    mana_middle.div.style.backgroundPosition = "-128px -320px";
  }
  if (value === 8) {
    mana_left.div.style.backgroundPosition = "-32px -320px";
    mana_right.div.style.backgroundPosition = "-288px -320px";
    mana_middle.div.style.backgroundPosition = "-128px -320px";
  }
};

var set_health = function (value /* 0-8*/) {
  if (value === 0) {
    health_left.div.style.backgroundPosition = "-96px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-256px -352px";
  }
  if (value === 1) {
    health_left.div.style.backgroundPosition = "-64px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-256px -352px";
  }
  if (value === 2) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-256px -352px";
  }
  if (value === 3) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-224px -352px";
  }
  if (value === 4) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-192px -352px";
  }
  if (value === 5) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-160px -352px";
  }
  if (value === 6) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-352px -352px";
    health_middle.div.style.backgroundPosition = "-128px -352px";
  }
  if (value === 7) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-320px -352px";
    health_middle.div.style.backgroundPosition = "-128px -352px";
  }
  if (value === 8) {
    health_left.div.style.backgroundPosition = "-32px -352px";
    health_right.div.style.backgroundPosition = "-288px -352px";
    health_middle.div.style.backgroundPosition = "-128px -352px";
  }
};

var update_stats = function () {
  set_mana(mana);
  set_health(health);
  if (health < 0) {
    (level = 1), (health = 8), (mana = 8), (coin_counter = 0);
    coin_ref.innerHTML = 0;
    update_stats();
    toast.makeToast("Game Over", 1000);
    setTimeout(function () {
      load_level(level);
    }, 50);
  }
};

// stats

// shop
var prices = {
  hp: 10,
  mp: 1,
};

function ScrollSelector(width, height, values, callback) {
  var container = new Element({
    scrollSnapType: "y mandatory",
    overflowX: "hidden",
    overflowY: "scroll",
    width: width + "px",
    height: height + "px",
    borderRadius: "10px",
  });

  var tabs = [];
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    var tab = new Element({
      width: width + "px",
      height: height / 2 + "px",
      background: "white",
      color: "black",
      lineHeight: height / 2 + 7 + "px",
      textAlign: "center",
      overflow: "hidden",
      scrollSnapAlign: "center",
    });
    tab.text = value;
    tab.div.setAttribute("value", value);
    container.appendChild(tab);
    tabs.push(tab);

    if (i === 0) tab.div.style.borderTop = height / 4 + "px solid white";
    if (i == values.length - 1)
      tab.div.style.borderBottom = height / 4 + "px solid white";
  }

  container.add_event_listeners("scroll", function () {
    var s = container.div.scrollTop;
    var i = s / (height / 2);
    if (i % 1 === 0) {
      container.value = values[i];
      for (var j in tabs) tabs[j].div.style.fontWeight = "lighter";
      tabs[i].div.style.fontWeight = "bolder";
      callback(container.value);
    }
  });

  container.value = values[0];
  for (var j in tabs) tabs[j].div.style.fontWeight = "lighter";
  tabs[0].div.style.fontWeight = "bolder";

  container.tabs = tabs;
  return container;
}

var shop_exit = new Element({
  width: "30px",
  height: "30px",
  position: "absolute",
  right: "10px",
  top: "10px",
  background: "red",
  color: "#fff",
  borderRadius: "5px",
});
shop_exit.text =
  "<svg width='30px' height='30px'><path" +
  " d='M7 7 l16 16 M23 7 L7 23' stroke='white' stroke-width" +
  "='5'></path></svg>";

shop_exit.add_event_listeners("click", function () {
  shop_exit.remove();
  shop_container.fade_out();
  resume();
});

var shop_container = new Element({
  width: "180px",
  height: "150px",
  background: "rgba(255, 255, 255, 0.5)",
  borderRadius: "20px",
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

var shop_mana_container = new Element({
  height: "50px",
  width: "110px",
  position: "fixed",
  left: "20px",
  top: "20px",
});

var shop_health_container = new Element({
  height: "50px",
  width: "110px",
  position: "fixed",
  left: "20px",
  top: "80px",
});

var mana_selector = new ScrollSelector(50, 50, [1, 2, 3, 4, 5], function (v) {
  mana_selector.remove();
  shop_mana_container.appendChild(shop_mana_potion);
  shop_mana_potion.text = v;
  shop_mana_coin.text = v * prices.mp;
});

var shop_mana_potion = new Element({
  width: "50px",
  height: "50px",
  left: "0",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "800px 800px",
  backgroundPosition: "0 -500px",
  lineHeight: "72px",
  color: "#000",
  textAlign: "center",
  fontWeight: "bolder",
});
shop_mana_potion.text = 1;
shop_mana_potion.add_event_listeners("click", function () {
  shop_mana_potion.remove();
  shop_mana_container.appendChild(mana_selector);
});

var shop_mana_coin = new Element({
  width: "50px",
  height: "50px",
  left: "60px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "800px 800px",
  backgroundPosition: "0 -400px",
  lineHeight: "57px",
  color: "#000",
  textAlign: "center",
  fontWeight: "bolder",
});
shop_mana_coin.text = 1 * prices.mp;
shop_mana_coin.add_event_listeners("click", function () {
  if (
    coin_counter >= parseInt(shop_mana_coin.text) &&
    mana <= 8 - parseInt(shop_mana_potion.text)
  ) {
    coin_counter -= parseInt(shop_mana_coin.text);
    mana += parseInt(shop_mana_potion.text);
    update_stats();
    coin_ref.text = coin_counter;
  }
});

shop_mana_container.appendChild(shop_mana_potion);
shop_mana_container.appendChild(shop_mana_coin);

var health_selector = new ScrollSelector(50, 50, [1, 2, 3], function (v) {
  health_selector.remove();
  shop_health_container.appendChild(shop_health_potion);
  shop_health_potion.text = v;
  shop_health_coin.text = v * prices.hp;
});

var shop_health_potion = new Element({
  width: "50px",
  height: "50px",
  left: "0",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "800px 800px",
  backgroundPosition: "0 -550px",
  lineHeight: "72px",
  color: "#000",
  textAlign: "center",
  fontWeight: "bolder",
});
shop_health_potion.text = 1;
shop_health_potion.add_event_listeners("click", function () {
  shop_health_potion.remove();
  shop_health_container.appendChild(health_selector);
});

var shop_health_coin = new Element({
  width: "50px",
  height: "50px",
  left: "60px",
  position: "absolute",
  top: "0",
  backgroundImage: "url(" + link + ")",
  backgroundSize: "800px 800px",
  backgroundPosition: "0 -400px",
  lineHeight: "57px",
  color: "#000",
  textAlign: "center",
  fontWeight: "bolder",
});
shop_health_coin.text = 1 * prices.hp;
shop_health_coin.add_event_listeners("click", function () {
  if (
    coin_counter >= parseInt(shop_health_coin.text) &&
    health <= 8 - parseInt(shop_health_potion.text)
  ) {
    coin_counter -= parseInt(shop_health_coin.text);
    health += parseInt(shop_health_potion.text);
    update_stats();
    coin_ref.text = coin_counter;
  }
});

shop_health_container.appendChild(shop_health_potion);
shop_health_container.appendChild(shop_health_container);
shop_container.appendChild(shop_exit);

/* </Shop> */

// sprite class

function Sprite() {
  this.img = new Image();
  this.img.crossOrigin = "*";
  this, (img.src = link);
  this.active_data;
  this.cycle_array;
  this.interval;

  this.blit = function (x, y, m) {
    var d = this.active_data;
    if ((d && d[6] && !m) || (d && !d[6] && m)) {
      ctx.setTransform(-1, 0, 0, 1, x, y);
      ctx.drawImage(this.img, d[0], d[1], d[2], d[3], -d[5], 0, d[4], d[5]);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (d) {
      ctx.drawImage(this.img, d[0], d[1], d[2], d[3], x, y, d[4], d[5]);
    }
  };

  this.set_cycle = function (array, time, mirror) {
    time = time || 150;
    var cycle = [];
    for (var i in array) {
      var d = data.tile[Math.abs(array[i])];
      if (array[i] < 0 || mirror) d = d.concat(true);
      cycle.push(d);
    }

    if (!equals(cycle, this.cycle_array)) {
      this.cycle_array = [-1, cycle];
      var update = () => {
        this.update_cycle(this.cycle_array);
      };
      update();
      //if(this.interval) this.interval.pause();
      this.animation_interval = new Interval(update, time);
    }
  };

  this.update_cycle = function (array) {
    var ca = array;
    this.cycle_array[0] = cal[0] > ca[1].length - 2 ? 0 : ca[0] + 1;
    this.active_data = ca[1][this.cycle_array[0]];
  };

  this.get_cycle = function (array) {
    var cycle = [];
    for (var i in array) {
      var d = data.tiles[Math.abs(array[i])];
      if (array[i] < 0) d = d.concat(true);
      cycle.push(d);
    }
    return cycle;
  };

  this.update_animation = function () {
    this.animation_interval.update();
  };

  this.update = function () {
    if (this.interval) this.interval.update();
  };
}

// sprite class

//mage class

var mage_bullets = [];
function Mage(scale) {
  Sprite.call(this);
  this.vel = { x: 0, y: 0 };
  this.pos = { x: 48, y: 48 };
  this.gravity = { x: 0, y: 0.5 };
  this.friction = { x: 1, y: 1 };
  this.size = 24;
  this.on_ground = false;
  this.at_wall = false;
  this.mirror = false;
  this.shot = false;
  this.invincible = false;
  this.in_double = false;
  this.in_air = true;
  var self = this;

  this.draw = function (x, y) {
    this.blit(x - this.size / 2, y - this.size / 2, this.mirror);
  };

  var min = function (u, v) {
    return Math.abs(u) < v ? u : u < 0 ? -v : v;
  };

  this.update = function () {
    var keyboard = handle_keyboard(this);

    var dx = keyboard.dx || (joystick.right ? 1 : joystick.left ? -1 : 0);
    var dy = -keyboard.dy || 0;

    if (use_joystick && !paused) {
      this.vel.x = min(this.vel.x + dx / 3, 3);
      if (dx === 0) this.vel.x *= 0.85;
      if (Math.abs(this.vel.x) < 0.1) this.vel.x = 0;

      if (dx > 0) this.mirror = false;
      if (dx < 0) this.mirror = true;

      if ((joystick.jump || dy > 0) && this.on_ground) {
        this.jump(this.in_air ? 1.5 : 2);
      }

      if (this.vel.y > 0 && !this.in_double && (joystick.jump || dy > 0)) {
        this.in_double = true;
        this.jump(2);
      }

      thi.vel.x += this.gravity.x * this.friction.x;

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      if (!this.on_ground) {
        this.vel.y += this.gravity.y * this.friction.y;
      } else {
        this.in_double = false;
        this.in_air = false;
      }

      if (this.at_wall) {
        this.in_double = false;
        this.in_air = false;
        if ((dx > 0 || joystick.jump || dy > 0) && this.at_wall === "l")
          this.jump(2, 3);
        if ((dx < 0 || joystick.jump || dy > 0) && this.at_wall === "r")
          this.jump(2, -3);
      }

      if (!this.on_ground && !this.at_wall) {
        this.in_air = true;
      }

      if (this.vel.y < 0) this.set_cycle(data.mage.jump);
      if (this.vel.y > 0 && !mage.on_wall) this.set_cycle(data.mage.fall);
      if (this.vel.y > 9 && !mage.on_wall) this.set_cycle(data.mage.fast_fall);
      if (this.on_ground && dx === 0) this.set_cycle(data.mage.idle);
      if (this.at_wall && !this.on_ground) this.set_cycle(data.mage.wall);
      if (this.on_ground && dx !== 0) this.set_cycle(data.mage.walk);

      if (keyboard.shooting || joystick.shoot || this.shot) {
        this.shoot(250); // coldown ms
        this.set_cycle(data.mage.shoot);
      }

      if (this.vel.x !== 0 || this.vel.y !== 0) minimap.reposition();
    }
  };

  this.jump = function (sy, sx) {
    this.in_air = true;

    var x = Math.abs(sx || 0);
    var y = Math.sqrt((map.tile_size * (map.tile_size * sy)) / 32);
    x = Mat.sqrt((map.tile_size * (map.tile_size * x + this.size / 2)) / 32);
    this.vel.y = -y;
    this.vel.x += sx > 0 ? x : sx < 0 ? -x : 0;
  };

  this.shoot = function (cooldown) {
    if (!this.shot && mana > 0 && !paused) {
      mana--;
      update_stats();
      this.shot = true;
      var a = this;
      var relaoad = function () {
        space_key_down = false;
        a.shot = false;
      };
      setTimeout(reload, cooldown);
      var bullet = new mage_bullets(this.pos, this.mirror);
      mage_bullets.push(bullet);
    }
  };
}

Mage.prototype = Object.create(Sprite.prototype);

// Mage Class

// Enemy Class
function Enemy(x, y) {
  Sprite.call(this);
  this.size = 24;
  this.pos = {
    x: (x + 0.5) * map.tile_size + (map.tile_size - this.size) / 2,
    y: (y + 0.5) * map.tile_size + (map.tile_size - this.zie) / 2,
  };
  this.mirror = false;
  var color = Math.floor(4 * Math.random());

  this.create = function () {
    this.id = get_id();
    this.set_cycle(data.enemy[color], 300);
    map.data.foreground[this.id] = this;

    var a = this;
    this.interval = new Interval(function () {
      var np = { x: pos.x + map.tile_size / (a.mirror ? -6 : 6), y: a.pos.y };
      var col = block.collisions(a.pos, a.size);
      if ((col.bbl && !col.bbr) || (col.bbr && !col.bbl) || col.tr || col.tl) {
        a.mirror = !a.mirror;
      }
      a.pos.x += map.tile_size / (a.mirror ? -20 : 20);
    }, 40);
  };

  this.draw = function (x, y) {
    // var x = this.pos.x + map.offset.x;
    // var y = this.pos.y + map.offset.y;
    this.blit(x - this.size / 2, y - this.size / 2, this.mirror);
  };

  this.create();
}

Enemy.prototype = Object.create(Sprite.prototype);

// Enemy class

// projectile class
function MageBullet(pos, mirror) {
  Sprite.call(this);
  this.post = { x: pos.x, y: pos.y };
  this.size = 24;
  this.mirror = mirror;

  this.create = function () {
    this.id = get_id();
    this.set_cycle(data.bullet.move, 500);
    map.data.foreground[this.id] = this;
    var a = this;
    this.interval = new Interval(function () {
      a.pos.x += map.tile_size / (a.mirror ? -3 : 3);
    }, 15);
  };

  this.draw = function (x, y) {
    // var coords = map.get_coords([this.pos.y, this.pos.x]);
    // var x = this.pos.x + map.offset.x;
    // var y = this.pos.y + map.offset.y;
    this.blit(x - this.size / 2, y - this.zie / 2, this.mirror);
  };

  this.create();
}

MageBullet.prototype = Object.create(Sprite.prototype);

// projectile class
function MageBullet(pos, mirror) {
  Sprite.call(this);
  this.pos = {x: pos.x, y: pos.y};
  this.size = 24;
  this.mirror = mirror;

  this.create = function() {
    this.id = get_id();
    this.set_cycle(data.bullet.move, 500);
    map.data.foreground[this.id] = this;
    var a = this;
    this.interval = new Interval(function() {
      a.pos.x += map.tile_size/(a.mirror?-3:3);
    }, 16);
  };

  this.draw = function(x,y) {
         // var coords = map.get_coords([this.pos.y, this.pos.x]);
        // var x = this.pos.x + map.offset.x;
        // var y = this.pos.y + map.offset.y;
        this.blit(x-this.size/2, y-this.size/2, this.mirror);
  }

  this.create();
}

MageBullet.prototype = Object.create(Sprite.prototype);

// projectile



//coin class

function Coin(x, y) {
  Sprite.call(this);
  this.pos = { x: x, y: y };
  this.coords = map.get_coords([y, x]);
  this.size = 24;
  this.id = get_id();
  this.draw = function () {
    var x = this.coords.x + map.offset.x;
    var y = this.coords.y + map.offset.y;
    this.blit(x - this.size / 2, y - this.size / 2);
  };
}

Coin.prototype = Object.create(Sprite.prototype);

// coin class





/* <Map class> */


/* Background is the background image and shouldn't be
   changed in game. Foreground is for light data images
   and sprites that need to update every frame.
   Updating background needs a Map.create call to render changes 
*/
function Map() {
  this.tile_size = 32; // parseInt(prompt("Blocksize: ", 32));
  this.width = null;
  this.height = null;
  this.img = new Image();
  this.offset = {x:0, y:0}; // drawing offset (translation)
  this.data = {foreground:{}};
  this.create = function() {
      var h = this.tile_size*this.data.background.length;
      var w = this.tile_size*this.data.background[0].length;
      c.width = w; c.height = h;
      c.style.width = w+"px"; c.style.height = h+"px";
      this.detailed_draw();
      this.img.src = c.toDataURL("image/png")
      .replace("image/png","image/octet-stream");
      c.width = W; c.height = H;
      c.style.width = W+"px"; c.style.height = H+"px";
  };
  this.draw = function() {
      /* background image */
      if(this.background_img)
          ctx.drawImage(this.background_img,
          this.offset.x-window.innerWidth/2-50, this.offset.y-window.innerHeight/3);
      
      /* static background */
      ctx.drawImage(this.img, this.offset.x, this.offset.y);
      
      /* non-static foreground */
      for(var i in this.data.foreground) {
          var sprite = this.data.foreground[i];
          sprite.draw(sprite.pos.x+this.offset.x,
                      sprite.pos.y+this.offset.y);
      }
  };
  this.detailed_draw = function() {
      for(var y in this.data.background) {
          for(var x in this.data.background[y]) {
              var tile_id = this.data.background[y][x];
              if(this.enemy_tile == tile_id) tile_id = 0;
              var mirror_tile = tile_id < 0;
              var tile = this.data.tiles[Math.abs(tile_id)][0];
              if(mirror_tile) tile = this.mirror_tile(tile);
          
              
              if(32 % tile.length !== 0)
                  throw "Tile SizeError: tile "+tile_id+
                        ": "+tile.length;
              var height = this.tile_size/tile.length;
                  
              for(var ty in tile) {
                  if(32 % tile[ty].length !== 0)
                  throw "Tile SizeError: tile "+tile_id+
                        ": "+tile[ty].length;
                  var width = this.tile_size/tile[ty].length;
                  for(var tx in tile[ty]) {
                      ctx.fillStyle =
                      this.data.colors[tile[ty][tx]];
                      ctx.fillRect(x*this.tile_size+tx*
                                   width+this.offset.x,
                                   y*this.tile_size+ty*
                                   height+this.offset.y,
                                   width, height);
                  }
              }
          }
      }
  };
  this.mirror_tile = function(tile) {
      var new_tile = JSON.parse(JSON.stringify(tile));
      for(var i in new_tile) new_tile[i].reverse();
      return new_tile;
  };
  this.get_tile = function(x,y) {
      return this.data.background[y][x];
  };
  this.get_coords = function(a) {
      return {x: this.tile_size*a[1]+this.tile_size/2,
              y: this.tile_size*a[0]+this.tile_size/2};
  };
  
  this.update_animation = function() {
      if(!paused) {
         for(var i in this.data.foreground) {
              this.data.foreground[i].update_animation();
          }
      }
  };
  
  this.update = function() {
      if(!paused) {
          for(var i in this.data.foreground) {
              this.data.foreground[i].update();
          }
      }
  };
}

/* </Map class> */




/* <Minimap class> */
var minimap_colors = { 
  0:"rgba(0,0,0,0)", 1:"#fff",
  enemy: "#f00", coin: "#ff0",
  bullet: "#f0f", 3: "#0f0",
  2: "#0f0", mage: "#0f0",
  4: "#00f", 5: "#fa0",
  6: "#0ff"
}

function Minimap(map, colors) {
  var mx = window.innerWidth-228+"px", my = "40px",
  x = "calc(100vw - 72px)", y = "40px";
}
/* </Minimap class> */




/* <Controls class> */
/* </Controls class> */



/* <DOM Element class> */
/* </DOM Element class> */



/* <Interval class> */
function Interval(callback, speed) {
  this.speed = speed;
  this.start = Date.now();
  this.update = function() {
    var now = Date.now();
    if(now - this.start >= this.speed) {
      this.start = now;
      callback();
    }
  }
}
/* </Interval class> */


/* <Class functions> */
/* </Class functions> */



/**************************************************************/





/*************************[FUNCTIONS]**************************/
var pause = function () {
  paused = true;
};

var resume = function() {
  paused = false;
}

var equals = function(c,a) {
  if(!a || !c) return false;
  for(var i in c) {
    for(var j in c[i]) {
      if(c[i][j] !== a[1][i][j]) return false;
    }
   } return true;
};

/* <Camera focus> */
/* <Camera focus> */


/* <Block effects> */
/* <Block effects> */

/* <Mage - Block collision> */
/* <Mage - Block collision> */

/* <Mage - Coin collision> */
/* <Mage - Coin collision> */

/* <Projectile collision> */
/* <Projectile collision> */

/* <Enemy collision> */
/* <Enemy collision> */

/* <Keyboard controls> */
/* <Keyboard controls> */

/* <Map initialization> */
/* <Map initialization> */


/***************************[DATA]****************************/

/* <Level loading> */
/* <Level loading> */

/* <Sprite + Level data> */
/* <Sprite + Level data> */


/* <Image slicing> */
/* <Image slicing> */


/**************************************************************/



// vvv
// coin deletion / interval deletion


/**************************************************************/
// var print = function(o) {console.log(JSON.stringify(o));};
// }
/**************************************************************/