const Place = require("../models/places_model");

class PlaceRepository {
  async createPlace(data) {
    

    const {
      name,
      address,
      lactitude,
      longitude,
      category,
      features,
      description,
      image,
    } = data;

    console.log(data.name);
    console.log(data.image);

    const place = await Place.create({
      name,
      address,
      lactitude: lactitude,
      longitude: longitude,
      category,
      features,
      description,
      image
    });

    //console.log(place);

    return await place.save();
  }

  async editPlace(data) {
    const { name, address, lactitude, longitude, category, features, id } =
      data;

    let newData = {};

    const place = await Place.findById(id);

    if (name != "") {
      newData.name = name;
    }
    if (address != "") {
      newData.address = address;
    }
    if (lactitude != "") {
      newData.lactitude = parseFloat(lactitude);
    }
    if (longitude != "") {
      newData.longitude = parseFloat(longitude);
    }
    if (category != "") {
      newData.category = category;
    }
    newData.features = features;

    await Place.findByIdAndUpdate({ _id: id }, newData);

    const placeStored = await Place.findById(id);

    return placeStored;
  }

  async editRating(data) {
    const { place, rating, id } = data;
    let newVotesCount = place.votes_count.concat(parseInt(rating));
    const newRating = (newVotesCount) => {
      return (
        newVotesCount.reduce((a, b) => a + b, 0) / newVotesCount.length
      ).toFixed();
    };

    let newData = {};
    newData.rating = newRating(newVotesCount);
    newData.votes_count = newVotesCount;

    await Place.findByIdAndUpdate({ _id: id }, newData);

    const placeStored = await Place.findById(id);

    return placeStored;
  }

  async getPlace() {
    return await Place.find().lean().exec();
  }

  async deletePlace(id) {
    return await Place.deleteOne({ _id: id });
  }

  async getFilterPlace(data) {
    console.log(data);
    const { name, category, features } = data;
    let nameFilter = {};
    let categoryFliter = {};
    let featuresFilter = {};
    if (name != "Todas") {
      nameFilter = { name: { $regex: name } };
    }
    if (category != "Todas") {
      categoryFliter = { category: category };
    }
    if (features.length != 0) {
      featuresFilter = { features: { $all: features } };
    }
    const placesFilter = Place.find({
      $and: [nameFilter, categoryFliter, featuresFilter],
    });
    return placesFilter;
  }
}

module.exports = PlaceRepository;
