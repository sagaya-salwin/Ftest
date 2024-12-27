import './SettingsPage.css'; // Assuming your CSS file is in the same directory
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    BrandName: '',
    FullName: '',
    Whatsapp: '',
    Email: '',
    brandLogo: '',
    shopImages: ['', '', '', '', '', ''],
    BrandWhatsapp: '',
    BrandEmail: '',
    Website: '',
    YearOfEstablishment: '',
    AboutCompany: '',
    OfficialAddress: '',
    State: '',
    City: '',
    FacebookLink: '',
    InstaLink: '',
    YoutubeLink: '',
        ContactPerson1Name: '',
        ContactPerson1Phone: '',
        ContactPerson1Designation: '',
        ContactPerson2Name: '',
        ContactPerson2Phone: '',
        ContactPerson2Designation: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user')
      .then((response) => setFormData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


  const handleFileUpload = async (e, key, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append(index !== null ? 'shopImage' : 'brandLogo', file);

    try {
      const endpoint = index !== null
        ? `http://localhost:5000/api/upload/shop-image?index=${index}`
        : 'http://localhost:5000/api/upload/logo';

      const response = await axios.post(endpoint, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (index !== null) {
        setFormData((prev) => {
          const updatedImages = [...prev.shopImages];
          updatedImages[index] = response.data.shopImage;
          return { ...prev, shopImages: updatedImages };
        });
      } else {
        setFormData((prev) => ({ ...prev, brandLogo: response.data.brandLogo }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/update', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating brand details:', error);
      alert('Error updating details. Please try again.');
    }
  };



  return (
    <div className="SettingsPageCard">
      <h1>Settings</h1>
      <p>Update your personal and company details</p>
      <hr />
      <form>
      <div className="form-container">
        <h2>Account</h2>
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="FullName">Full Name*</label>
            <input 
              type="text" 
              id="FullName" 
              placeholder="Please Enter Your Name" 
              value={formData.FullName} 
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="Whatsapp">Whatsapp*</label>
            <div className="whatsapp-input">
              <span>+91</span>
              <input 
                type="text" 
                id="Whatsapp" 
                placeholder="Please Enter Your Whatsapp Number" 
                value={formData.Whatsapp} 
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="form-group" style={{ width: '49.5%' }}>
          <label htmlFor="Email">Email*</label>
          <input 
            type="text" 
            id="Email" 
            placeholder="Please Enter Your Email" 
            value={formData.Email} 
            readOnly
          />
        </div>
      </div>
<hr></hr>
      <section>
        <h2>Brand Details</h2>
        <div className="brand-images-container">
        <div className="form-group-row">
            {/* Brand Logo */}
            <div className="form-group">
              <label>Brand Logo</label>
              <div className="logo">
                {formData.brandLogo ? (
                  <img
                    src={formData.brandLogo}
                    alt="Brand Logo"
                    onClick={() => document.getElementById('brandLogoInput').click()}
                  />
                ) : (
                  <div
                    className="empty-box"
                    onClick={() => document.getElementById('brandLogoInput').click()}
                  >
                    <p>+</p>
                  </div>
                )}
                <input
                  id="brandLogoInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'brandLogo')}
                />
              </div>
              <p>Click the box to upload your logo</p>
            </div>

            {/* Shop Images */}
            <div className="form-group">
              <label>Shop Images</label>
              <div className="horizontal-images">
                {formData.shopImages.map((image, index) => (
                  <div key={index} className="shop-image-container">
                    {image ? (
                      <img
                        src={image}
                        alt={`Shop Image ${index + 1}`}
                        onClick={() =>
                          document.getElementById(`shopImageInput-${index}`).click()
                        }
                      />
                    ) : (
                      <div
                        className="empty-box"
                        onClick={() =>
                          document.getElementById(`shopImageInput-${index}`).click()
                        }
                      >
                        <p>+</p>
                      </div>
                    )}
                    <input
                      id={`shopImageInput-${index}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'shopImages', index)}
                    />
                  </div>
                ))}
              </div>
              <p>Click any box to upload a new image (max 1MB each, limit 6 images)</p>
            </div>
          </div>
          </div>
        </section>
        
        

        <div className="brand-detail-container">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="BrandName">Brand Name</label>
              <input type="text" id="BrandName" placeholder="" readOnly  
              value={formData.BrandName} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="BrandWhatsapp">Whatsapp</label>
              <div className="whatsapp-input">
                <span>+91</span>
                <input type="text" id="BrandWhatsapp" placeholder="Please Enter Your Whatsapp Number"
                 value={formData.BrandWhatsapp} onChange={handleInputChange}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="BrandEmail">Company Email</label>
              <input type="text" id="BrandEmail" placeholder="Eg:Yourcompany@gmail.com" 
              value={formData.BrandEmail} onChange={handleInputChange}/>
            </div>
          </div>

          <div className="form-group-row-2">
            <div className="form-group">
              <label htmlFor="Website">Website</label>
              <input type="text" id="Website"  value={formData.Website} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="YearOfEstablishment">Year of Establishment</label>
              <input type="text" id="YearOfEstablishment" value={formData.YearOfEstablishment} onChange={handleInputChange}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="AboutCompany">About Your Company</label>
            <textarea id="AboutCompany" placeholder="Tell us a little bit about your company" 
            value={formData.AboutCompany} onChange={handleInputChange}></textarea>
          </div>

          <div className="form-group" style={{ width: '68%' }}>
            <label htmlFor="OfficialAddress">Official Address</label>
            <input id="OfficialAddress" placeholder="" value={formData.OfficialAddress} onChange={handleInputChange} />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="State">States</label>
              <select id="State" value={formData.State} onChange={handleInputChange}>
                <option value="">Select a State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="City">City</label>
              <input type="text" id="City" placeholder="Enter Your City" value={formData.City} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="Country">Country</label>
              <input type="text" id="Country" value="India" readOnly />
            </div>
          </div>

          <div className="BrandSocilaMedia">
            <h2>Social Media Links</h2>
            <div className="form-group-row">
            <div class="form-group">
                        <div class="logo-text">
                            <img src="/images/facebook-logo.png" alt="logo" class="logo" id="FacebookLink"/>
                            <span>Facebook</span>
                          </div>                      
                        <input type="text" id="FacebookLink" placeholder="" value={formData.FacebookLink}  onChange={handleInputChange}/>
                    </div>
                    <div class="form-group">
                        <div class="logo-text">
                            <img src="/images/instagram-logo.png" alt="logo" class="logo" id="InstaLink"/>
                            <span>Instagram</span>
                          </div>                      
                        <input type="text" id="InstaLink" placeholder="" value={formData.InstaLink} onChange={handleInputChange}/>
                    </div>
                    <div class="form-group">
                        <div class="logo-text">
                            <img src="/images/youtube-logo.png" alt="logo" class="logo" id="YoutubeLink"/>
                            <span>Instagram</span>
                          </div>                      
                        <input type="text" id="YoutubeLink" placeholder="" value={formData.YoutubeLink} onChange={handleInputChange}/>
                    </div>
            </div>
          </div>
        </div>

      <hr></hr>

        <div className="ContactDetails">
          <h2>Contact Details</h2>
          <h4>Add Your Contact Details For Your Customer to Reach Easily</h4>
          <div className="Contact1">
            <h3>Contact Person 1</h3>
            <div className="form-group-row">
            <div class="form-group">
                        <label for="ContactPerson1Name">Contact Person Name</label>
                        <input type="text" id="ContactPerson1Name" placeholder="Contact Person Name" 
                        value={formData.ContactPerson1Name}
                        onChange={handleInputChange}/>
                    </div>
                    <div class="form-group">
                        <label for="ContactPerson1Phone">Phone Number</label>
                        <div class="whatsapp-input">
                            <span>+91</span>
                            <input type="text" id="ContactPerson1Phone" placeholder="Phone Number"
                             value={formData.ContactPerson1Phone}  
                             onChange={handleInputChange}/>
                        </div>
                    </div>                   
                    <div class="form-group">
                        <label for="ContactPerson1Designation">Designation/Role</label>
                        <select id="ContactPerson1Designation" value={formData.ContactPerson1Designation} onChange={handleInputChange}>
                            <option value="">Select a Designation</option>
                            <option value="Manager">Manager</option>
                            <option value="Assistant Manager">Assistant Manager</option>
                            <option value="Team Lead">Team Lead</option>
                            </select>
                    </div>
            </div>
          </div>
          <div className="Contact2">
            <h3>Contact Person 2</h3>
            <div className="form-group-row">
            <div class="form-group">
                        <label for="ContactPerson2Name">Contact Person Name</label>
                        <input type="text" id="ContactPerson2Name" placeholder="Contact Person Name" value={formData.ContactPerson2Name}
                        onChange={handleInputChange} />
                    </div>
                    <div class="form-group">
                        <label for="ContactPerson2Phone">Phone Number</label>
                        <div class="whatsapp-input">
                            <span>+91</span>
                            <input type="text" id="ContactPerson2Phone" placeholder="Phone Number"  value={formData.ContactPerson2Phone} onChange={handleInputChange}/>
                            
                  
                        </div>
                    </div>                   
                    <div class="form-group">
                        <label for="ContactPerson2Designation">Designation/Role</label>
                        <select id="ContactPerson2Designation"   onChange={handleInputChange} value={formData.ContactPerson2Designation}>
                            <option value="">Select a Designation</option>
                            <option value="Manager">Manager</option>
                            <option value="Assistant Manager">Assistant Manager</option>
                            <option value="Team Lead">Team Lead</option>                            
                            </select>
                    </div>
            </div>
          </div>
        </div>
        <hr />
      </form>


          
        <button className="update-button" onClick={handleUpdate}>
          Update
        </button>
        

    </div>
  );
};

export default SettingsPage;
