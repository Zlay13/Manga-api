const AxiosService = require("../helpers/axiosService");
const router = require("express").Router();
const cheerio = require("cheerio");

// home -------Done------
router.get("/s", async (req, res) => {
  let url = "https://m.meownime.ai//";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var detailUrlNew = detailUrl.filter(function (el) {
        return el != '/ongoing/' && el != '/completed/' && el != '/movie/' && el != "https://m.meownime.ai//";
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrlNew[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});
// home -------Done------
router.get("/", async (req, res) => {
  let url = "https://65.108.132.145/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      
      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.inf > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > div.thumb > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > div.thumb > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      // var detailUrlNew = detailUrl.filter(function (el) {
      //   return el != '/ongoing/' && el != '/completed/' && el != '/movie/' && el != "https://m.meownime.ai//";
      // });
      let list_popular = [];
      $('.hothome').next().find(".excstf").children().each(function (i, e) {
        const anime = {
          title: $(this).find('.eggtitle').text(),
          image_url: $(this).find('.bsx img').attr("src"),
          detail_url: $(this).find('.bsx > a').attr("href"),
          episode : $(this).find('.eggepisode').text()
        };
        list_popular.push(anime)
        // console.log($(this).find('.bsx > a').attr("href"))
      })

      const obj_popular = {
        title : $('.hothome h3').text(),
        data : list_popular
      };

      let list_latest = [];
      $('.latesthome').next().find(".excstf").children().each(function (i, e) {
        const anime = {
          title: $(this).find('h2 a').text(),
          status: $(this).find('ul li:first').text().replace("Status: ", ""),
          posted_by: $(this).find('ul li:nth-child(2)').text().replace("Posted by: ", ""),
          released_on: $(this).find('ul li:nth-child(3)').text().replace("Released on: ", ""),
          series: $(this).find('ul li:nth-child(4)').text().replace("series: ", ""),
          series_url: $(this).find('ul li:nth-child(4) a').attr("href"),
          genres: $(this).find('ul li:nth-child(5) a').length,
          image_url: $(this).find('.bsx img').attr("src"),
          detail_url: $(this).find('.bsx > a').attr("href"),
          episode : $(this).find('.eggepisode').text()
        };
        anime.genres = [];
        $(this).find('ul li:nth-child(5) a').each( (i, el) => {
          const genres = {
            title : $(el).text(),
            url : $(el).attr("href")
          }
          anime.genres.push(genres)
        } )
        list_latest.push(anime)
        // console.log($(this).find('.bsx > a').attr("href"))
      })
      const obj_latest = {
        title : $('.latesthome h3').text(),
        data : list_latest
      };

      $("div > div.thumb > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ 
        status: true, message: "success", data, obj_popular, obj_latest 
      });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// detail -------Done------
router.get("/detail/:param", async (req, res) => {
  const param = req.params.param;

  let url = `https://m.meownime.ai//${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let imageUrl = $("img").attr("src").trim();
      let titles = $("div > header > h1").text().trim();
      let season = $("div > div > ul > li:nth-child(2) > a").text().trim();
      let studio = $("div > div > ul > li.Studiox > a").text().trim().trim();
      let genre = $("div > div > ul > li.Genrex").text().substring(8).trim();
      let score = $("div > div > ul > li.Scorex").text().substring(21).trim();
      let credit = $("div > div > ul > li:nth-child(8)")
        .text()
        .substring(9)
        .trim();
      let premier = $("div > div > ul > li:nth-child(3)")
        .text()
        .substring(17)
        .trim();
      let duration = $("div > div > ul > li:nth-child(5)")
        .text()
        .substring(21)
        .trim();

      let dates = $(
        "div > header > div.entry-meta > span.posted-on > a > time.entry-date.published"
      )
        .text()
        .trim();

      let episodes = $("div > div > ul > li.Episodex");

      episodes == undefined || episodes == null
        ? (episodes = "Ongoing")
        : (episodes = $("div > div > ul > li.Episodex").text().substring(17));

      let synopsis = [];

      for (let j = 5; j <= 9; j++) {
        $(`div > div > p:nth-child(1n + ${j})`).each(function (i, e) {
          synopsis[i] += $(this).text();
        });
      }
      
      var data = [];
      for (let i = 0; i < 1; i++) {
        const detail = {
          dates: dates,
          title: titles,
          image_url: imageUrl,
          episodes: episodes,
          season: season,
          premier: premier,
          studio: studio,
          duration: duration,
          genre: genre,
          score: score,
          credit: credit,
          synopsis: synopsis[i],
          link: undefined,
        };
        data.push(detail);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// search -------Done------
router.get("/search/:param", async (req, res) => {
  let param = req.params.param;
  let url = `https://m.meownime.ai//?s=${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// genre -------Done------
router.get("/genre", async (req, res) => {
  let url = "https://m.meownime.ai//genre";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let title = [];
      let uri = [];

      $("#genre > div > ul > ul > li > a > span").each(function (i, e) {
        title[i] = $(this).text().trim();
      });

      $("#genre > div > ul > ul > li > a").each(function (i, e) {
        uri[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < title.length; i++) {
        const genre = {
          title: title[i],
          uri: uri[i],
        };
        data.push(genre);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// genre -------Done------
router.get("/genre", async (req, res) => {
  let url = "https://m.meownime.ai//genre";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let title = [];
      let uri = [];

      $("#genre > div > ul > ul > li > a > span").each(function (i, e) {
        title[i] = $(this).text().trim();
      });

      $("#genre > div > ul > ul > li > a").each(function (i, e) {
        uri[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < title.length; i++) {
        const genre = {
          title: title[i],
          uri: uri[i],
        };
        data.push(genre);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// genre detail -------Done------
router.get("/genre/:param", async (req, res) => {
  let param = req.params.param;
  let url = `https://m.meownime.ai//genre/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// genre pagination -------Done------
router.get("/genre/:param/page/:id", async (req, res) => {
  let param = req.params.param;
  let id = req.params.id;
  let url = `https://m.meownime.ai//genre/${param}/page/${id}`;

  if (url == `https://m.meownime.ai//genre/${param}/page/1`)
    url = `https://m.meownime.ai//genre/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      info: "exceed limit page",
    });
  }
});

// season -------Done------
router.get("/season", async (req, res) => {
  let url = "https://m.meownime.ai//genre/#season";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let title = [];
      let uri = [];

      $("#season > aside:nth-child(1n) > ul > div > div > ul > li > a").each(
        function (i, e) {
          title[i] = $(this).text().trim();
        }
      );

      $("#season > aside:nth-child(1n) > ul > div > div > ul > li > a").each(
        function (i, e) {
          uri[i] = $(this).attr("href");
        }
      );

      var data = [];
      for (let i = 0; i < title.length; i++) {
        const detail = {
          title: title[i],
          uri: uri[i],
        };
        data.push(detail);
      }

      data = data.slice(7);
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// season detail -------Done------
router.get("/season/:param", async (req, res) => {
  let param = req.params.param;
  let url = `https://m.meownime.ai//season/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// season pagination -------Done------
router.get("/season/:param/page/:id", async (req, res) => {
  let param = req.params.param;
  let id = req.params.id;

  let url = `https://m.meownime.ai//season/${param}/page/${id}`;
  if (url == `https://m.meownime.ai//season/${param}/page/1`)
    url = `https://m.meownime.ai//season/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      info: "exceed limit page",
    });
  }
});

// studio -------Done------
router.get("/studio", async (req, res) => {
  let url = "https://m.meownime.ai//genre/#studio";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let title = [];
      let uri = [];

      $("#studio > aside:nth-child(1n) > ul > div > div > ul > li > a").each(
        function (i, e) {
          title[i] = $(this).text().trim();
        }
      );

      $("#studio > aside:nth-child(1n) > ul > div > div > ul > li > a").each(
        function (i, e) {
          uri[i] = $(this).attr("href");
        }
      );

      var data = [];
      for (let i = 0; i < title.length; i++) {
        const studio = {
          title: title[i],
          uri: uri[i],
        };
        data.push(studio);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// studio detail -------Done------
router.get("/studio/:param", async (req, res) => {
  let param = req.params.param;
  let url = `https://m.meownime.ai//studio/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// studio pagination -------Done------
router.get("/studio/:param/page/:id", async (req, res) => {
  let param = req.params.param;
  let id = req.params.id;

  let url = `https://m.meownime.ai//studio/${param}/page/${id}`;
  if (url == `https://m.meownime.ai//studio/${param}/page/1`)
    url = `https://m.meownime.ai//studio/${param}`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let titles = [];
      let imageUrl = [];
      let detailUrl = [];

      $("div > div.out-thumb > h2 > a").each(function (i, e) {
        titles[i] = $(this).text();
      });

      $("div > a > img").each(function (i, e) {
        imageUrl[i] = $(this).attr("src");
      });

      $("div > a").each(function (i, e) {
        detailUrl[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < titles.length; i++) {
        const anime = {
          title: titles[i],
          imageUrl: imageUrl[i],
          detailUrl: detailUrl[i],
        };
        data.push(anime);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      info: "exceed limit page",
    });
  }
});

// completed -------Done------
router.get("/completed", async (req, res) => {
  let url = "https://m.meownime.ai//anime-list-baru/#completed";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      let $ = cheerio.load(response.data);

      let title = [];
      let uri = [];

      $("ul > div:nth-child(1n) > div > ul > li > a").each(function (i, e) {
        title[i] = $(this).text().trim();
      });

      $("ul > div:nth-child(1n) > div > ul > li > a").each(function (i, e) {
        uri[i] = $(this).attr("href");
      });

      var data = [];
      for (let i = 0; i < title.length; i++) {
        const completed = {
          title: title[i],
          uri: uri[i],
        };
        data.push(completed);
      }
      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

// schedule ------Done-----------
router.get("/schedule", async (req, res) => {
  let url = "https://m.meownime.ai//jadwal-rilis/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      let monday = [];
      let mondayUrl = [];

      let tuesday = [];
      let tuesdayUrl = [];

      let wednesday = [];
      let wednesdayUrl = [];

      let thursday = [];
      let thursdayUrl = [];

      let friday = [];
      let fridayUrl = [];

      let saturday = [];
      let saturdayUrl = [];

      let sunday = [];
      let sundayUrl = [];

      $("#Senin > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        monday[i] = $(this).text().trim();
      });

      $("#Senin > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        mondayUrl[i] = $(this).attr("href");
      });

      $("#Selasa > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        tuesday[i] = $(this).text().trim();
      });

      $("#Selasa > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        tuesdayUrl[i] = $(this).attr("href");
      });

      $("#Rabu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        wednesday[i] = $(this).text().trim();
      });

      $("#Rabu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        wednesdayUrl[i] = $(this).attr("href");
      });

      $("#Kamis > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        thursday[i] = $(this).text().trim();
      });

      $("#Kamis > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        thursdayUrl[i] = $(this).attr("href");
      });

      $("#Jumat > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        friday[i] = $(this).text().trim();
      });

      $("#Jumat > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        fridayUrl[i] = $(this).attr("href");
      });

      $("#Sabtu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        saturday[i] = $(this).text().trim();
      });

      $("#Sabtu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        saturdayUrl[i] = $(this).attr("href");
      });

      $("#Minggu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        sunday[i] = $(this).text().trim();
      });

      $("#Minggu > ul > div:nth-child(1n) > div > ul > li > a").each(function (
        i,
        e
      ) {
        sundayUrl[i] = $(this).attr("href");
      });

      var monData = [];

      for (let i = 0; i < monday.length; i++) {
        const data = {
          title: monday[i],
          uri: mondayUrl[i],
        };
        monData.push(data);
      }

      var tueData = [];

      for (let i = 0; i < tuesday.length; i++) {
        const data = {
          title: tuesday[i],
          uri: tuesdayUrl[i],
        };
        tueData.push(data);
      }

      var wedData = [];

      for (let i = 0; i < wednesday.length; i++) {
        const data = {
          title: wednesday[i],
          uri: wednesdayUrl[i],
        };
        wedData.push(data);
      }

      var thuData = [];

      for (let i = 0; i < thursday.length; i++) {
        const data = {
          title: thursday[i],
          uri: thursdayUrl[i],
        };
        thuData.push(data);
      }

      var friData = [];

      for (let i = 0; i < friday.length; i++) {
        const data = {
          title: friday[i],
          uri: fridayUrl[i],
        };
        friData.push(data);
      }

      var satData = [];

      for (let i = 0; i < saturday.length; i++) {
        const data = {
          title: saturday[i],
          uri: saturdayUrl[i],
        };
        satData.push(data);
      }

      var sunData = [];

      for (let i = 0; i < sunday.length; i++) {
        const data = {
          title: sunday[i],
          uri: sundayUrl[i],
        };
        sunData.push(data);
      }

      let data = [];

      const schedule = {
        monday: monData,
        tuesday: tueData,
        wednesday: wedData,
        thursday: thuData,
        friday: friData,
        saturday: satData,
        sunday: sunData,
      };
      data.push(schedule);

      return res.status(200).json({ status: true, message: "success", data });
    }
    return res.send({
      message: response.status,
      data: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      data: [],
    });
  }
});

module.exports = router;