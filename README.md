### Project 4: USA Glaciers

#### Overview
This project focuses on analyzing glacier data in the USA, utilizing various data sources and machine learning techniques to predict glacier types and visualizing USA glacier related trends such as location, area of glacier, elevation and temperature.

#### Data Sets
- **Glacier Dataset**: NASA - NSIDC Data (https://nsidc.org/home)
- **Temperature Dataset**: NCEI Climate at a Glance (https://www.ncei.noaa.gov)
- **Location Data**: Simple Maps US Cities (https://simplemaps.com/data/us-cities)

#### Repository Structure
- **Analysis**: Contains Statistical Analysis workbook
- **Dashboard**: Final dashboard and resource files with images and HTML files. Select `index.html` to run the dashboard.
- **Database**: SQL database
- **Notebook**: Jupyter notebooks for data cleaning and modeling.
- **Resources**: Original data and resources used.
- **.gitattributes**
- **.gitignore**: Ensures unnecessary files and folders are excluded.
- **README.md**

#### Data Cleaning and Preparation
1. **Data Acquisition**: Data about glaciers was acquired from NASA in .kml format and supporting data related to temperature and location.
2. **Cleaning**: Loaded into Jupyter Notebook, removed unnecessary columns, and cleaned data.
3. **Saving**: Cleaned data was saved to a CSV file, loaded into a database, and then into a dataframe.

#### Data Modeling
1. **Separation**: Numerical data was separated from categorical data.
2. **Dummy Variables**: Created dummy variables from categorical data and merged them back.
3. **Splitting**: Data was split into testing and training sets.
4. **Model Initialization**: Initialized `RandomForestClassifier` and trained the model.
5. **Prediction**: Initially predicted glacier existence, but shifted to predicting glacier types due to poor initial results.
6. **Performance**: Achieved an R-square score of 93% for predicting glacier types.

#### Data Visualization
1. **Temperature Time Series**: Average temperatures from 1990 to 2024.
2. **Scatter Plot**: Shows the distribution of areas across different clusters. Most clusters have smaller areas, but a few outliers have significantly larger areas, with an average cluster size of about 144.0712 square units.
3. **Stacked Line Graph**: Displays the difference between the average minimum and maximum elevation in each glacier cluster.
4. **Location Scatterplot**: Visualizes the location of clusters based on latitude and longitude, forming the western border of Alaska where most American glaciers are located.
5. **Glacier Map with Interactive Features**:
   - **Map of Glaciers**: Displays the locations of glaciers.
   - **Dropdown Menu**: Allows selection of a specific glacier.
     - **Specifications**: Shows the date of analysis, area, and location.
     - **Hover Box**: Indicates whether the glacier still exists or no longer exists.

#### Limitations and Recommendations
- **Geographical Scope**: Data is limited to the USA, primarily Alaska and northern parts.
- **Feature Imbalance**: Uneven amount of features compared to documentation.
- **Recommendation**: Use global data for a more comprehensive analysis.

#### Conclusion
This project showcases the process of data cleaning, modeling, and visualization to analyze glacier data in the United States. The model accurately predicted glacier type. The model demonstrated high accuracy in predicting glacier types. Visual representations, integrating variables such as temperature, area, geographical location, and elevation, provided significant insights into glacier trends. To further enrich these findings, integrating higher-quality data, additional environmental factors, and expanding the analysis to include global data over extended periods could deepen our understanding of glacier dynamics and enhance our predictive capabilities regarding their formation and evolution.
