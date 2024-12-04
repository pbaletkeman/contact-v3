import Address from "./address.js";
import Contact from "./contact.js";

class JSONTools extends Model {
  static JSONToContact(body) {
    if (!body) {
      return new Contact();
    }
    let contact = new Contact();
    // console.log("body");
    // console.log(body.addresses);
    contact.contactId = body.contactid ? body.contactid : null;
    contact.firstName = body.firstname ? body.firstname : null;
    contact.lastName = body.lastname ? body.lastname : null;
    contact.middleName = body.middlename ? body.middlename : null;
    contact.birthDate = body.birthdate ? body.birthdate : null;
    // contact.addresses = body.addresses
    //   ? JSONTools.parseAddressJSON(body.addresses)
    //   : null;
    return contact;
  }
  static parseAddressJSON(addresses) {
    let adds = [];
    if (addresses && Array.isArray(addresses) && addresses.length > 0) {
      addresses.forEach((a) => {
        const address = JSONTools.JSONToAddress(a);
        adds.push(address);
      });
    }
    return adds;
  }

  static JSONToAddress(body) {
    if (!body) {
      return new Address();
    }

    let address = new Address();
    address.contactId = body.contactid ? body.contactid : null;
    address.addressId = body.addressid ? body.addressid : null;
    address.street1 = body.street1 ? body.street1 : null;
    address.street2 = body.street2 ? body.street2 : null;
    address.city = body.city ? body.city : null;
    address.province = body.province ? body.province : null;
    address.postalCode = body.postalcode ? body.postalcode : null;
    address.country = body.country ? body.country : null;
    address.phone = body.phone ? body.phone : null;
    address.email = body.email ? body.email : null;
    return address;
  }
}

export default JSONTools;
