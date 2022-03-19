const express = require("express");
const PlaceService = require("../services/place_service");
const upload = require("../libs/storage");

class PlaceController {
  constructor() {
    this.placeService = new PlaceService();
    this.router = express.Router();
    this.router.post("/", upload, (req, res) => this.createPlace(req, res));
    this.router.post("/img", upload, (req, res) => {

      let arrayFiles = Array.from(req.files).map(e => e.filename)

      //console.log(arrayFiles)
      return res.status(200).json(arrayFiles);
    }),
      this.router.put("/:id", upload, (req, res) => this.editPlace(req, res)),
      this.router.get("/", (req, res) => this.getPlace(req, res));
    this.router.delete("/", (req, res) => this.deletePlace(req, res));
    this.router.put("/rating/:id", (req, res) => this.editRating(req, res));
    this.router.put("/:rating", (req, res) => this.editRating(req, res));
    this.router.post("/filter", (req, res) => this.getFilterPlace(req, res));
  }

  createPlace(req, res) {
    const data = req.body;

    const placePromise = this.placeService.createPlace(data);
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }

  editPlace(req, res) {
    const data = req.body;
    const { id } = req.params;
    data.id = id;
    const placePromise = this.placeService.editPlace(data);
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        res.status(400).json(err);
        console.log(err);
      });
  }
  editRating(req, res) {
    const data = req.body;
    const { id } = req.params;
    data.id = id;
    const placePromise = this.placeService.editRating(data);
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        res.status(400).json(err);
        console.log(err);
      });
  }

  getPlace(req, res) {
    const placePromise = this.placeService.getPlace();
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }

  deletePlace(req, res) {
    const data = req.body;
    const { id } = data;
    const placePromise = this.placeService.deletePlace(id);
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        res.status(400).json(err);
        console.log(err);
      });
  }

  getFilterPlace(req, res) {
    const data = req.body;
    const placePromise = this.placeService.getFilterPlace(data);
    placePromise
      .then((place) => {
        res.json(place);
      })
      .catch((err) => {
        res.status(400).json(err);
        console.log(err);
      });
  }
}

module.exports = PlaceController;
