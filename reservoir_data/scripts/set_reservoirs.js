var fs = require('fs');
var d3 = require('d3');
var _ = require('lodash');

var reservoir_names = [
    "Upper Klamath",
    "Gerber",
    "Clear Lk   Klamath R",
    "Dwinnell",
    "Trinity Lake",
    "Lewiston",
    "Lake Pillsbury",
    "Lake Mendocino",
    "Warm Springs",
    "Soulajule Dam",
    "Nicasio",
    "Kent",
    "Alpine Lake",
    "Lake Hennessey",
    "Briones Dam",
    "U San Leandro",
    "Chabot",
    "Del Valle",
    "San Antonio Reservoir",
    "Calaveras",
    "Lexington Reservoir",
    "Leroy Anderson",
    "Coyote Res Sta Clara",
    "Lower Crystal Springs Reservoir",
    "San Pablo",
    "San Andreas",
    "Lake San Antonio",
    "Whale Rock",
    "Santa Margarita Lake",
    "Nacimiento",
    "Lake Jennings",
    "Twitchell",
    "Cachuma Lake",
    "Gibraltar Dam",
    "Matilija Dam",
    "Casitas",
    "Pyramid",
    "Bouquet Canyon",
    "Castaic",
    "Lake Piru",
    "Cogswell Reservoir",
    "San Gabriel",
    "Lake Mathews",
    "Perris",
    "Lake Hemet",
    "Bear Valley Dam",
    "Santiago Creek Res",
    "Railroad Canyon",
    "Diamond Valley",
    "Vail Lake",
    "Sutherland Reservoir",
    "Lake Hodges",
    "Skinner",
    "Henshaw",
    "Cuyamaca Dam",
    "San Vicente",
    "Miramar",
    "El Capitan Dam",
    "Murray Res",
    "Morena Dam",
    "Barrett",
    "Loveland Reservoir",
    "Sweetwater Reservoir",
    "Lower Otay",
    "Shasta Dam",
    "Keswick Reservoir",
    "Whiskeytown Dam",
    "Lake Mccloud",
    "Iron Canyon",
    "Lake Britton",
    "Black Butte",
    "Stony Gorge Reservoir",
    "East Park Reservoir",
    "Mountain Meadows",
    "Lake Almanor",
    "Butt Valley",
    "Antelope Lake",
    "Bucks Lake Storage",
    "Lake Davis",
    "Frenchman Dam",
    "Little Grass Valley",
    "Sly Creek",
    "Oroville Dam",
    "Thermalito  Total",
    "Bowman Lake",
    "Lake Spaulding S Yuba System",
    "French Lake",
    "New Bullards Bar",
    "Scotts Flat",
    "Englebright",
    "Rollins",
    "Bear River At Camp Far West Dam",
    "French Meadows",
    "Hell Hole",
    "Loon Lake",
    "Union Valley",
    "Ice House",
    "Slab Creek",
    "Caples Lake",
    "Folsom Lake",
    "Lake Natoma",
    "Indian Valley",
    "Clear Lk   Cache Creek",
    "Berryessa",
    "Los Vaqueros Reservoir",
    "Jenkinson Lake",
    "Lower Bear",
    "Salt Springs",
    "Pardee",
    "Camanche Reservoir",
    "New Hogan Lake",
    "Spicer Meadows",
    "Donnells",
    "Relief",
    "Beardsley Lake",
    "Strawberry",
    "New Melones Reservoir",
    "Tulloch",
    "Cherry Lake",
    "Lake Eleanor",
    "Hetch Hetchy",
    "Don Pedro Reservoir",
    "Modesto Reservoir",
    "Turlock Lake",
    "Lake Mcclure",
    "Buchanan Dam",
    "Hidden Dam",
    "Thomas A Edison",
    "Mammoth Pool",
    "Crane Valley",
    "Florence Lake",
    "Huntington Lake",
    "Shaver Lake",
    "Redinger Lake",
    "Friant Dam",
    "San Luis Reservoir",
    "Oneill Forebay",
    "San Luis Reservoir",
    "Los Banos",
    "Courtright",
    "Wishon",
    "Pine Flat Dam",
    "Terminus Dam",
    "Success Dam",
    "Isabella Dam",
    "Stampede",
    "Boca Reservoir",
    "Prosser Creek Reservoir",
    "Lake Tahoe",
    "Bridgeport Reservoir",
    "Saddlebag Lake Reservoir",
    "Grant Lake",
    "Gem  Lake",
    "Lake Crowley",
    "South Lake",
    "Tinemaha Reservoir",
    "Haiwee",
    "Lake Silverwood",
    "Abilene",
    "Addicks",
    "Alan Henry",
    "Amistad",
    "Amon G Carter",
    "Aquilla",
    "Arlington",
    "Arrowhead",
    "Athens",
    "Austin",
    "B A Steinhagen",
    "Bardwell",
    "Belton",
    "Benbrook",
    "Bob Sandlin",
    "Bonham",
    "Brady Creek",
    "Bridgeport",
    "Brownwood",
    "Buchanan",
    "Caddo",
    "Canyon",
    "Cedar Creek",
    "Champion Creek",
    "Choke Canyon",
    "Cisco",
    "Coleman",
    "Coleto Creek",
    "Colorado City",
    "Conroe",
    "Corpus Christi",
    "Crook",
    "Cypress Springs",
    "E V Spence",
    "Eagle Mountain",
    "Elephant Butte",
    "Falcon",
    "Fork",
    "Fort Phantom Hill",
    "Georgetown",
    "Graham",
    "Granbury",
    "Granger",
    "Grapevine",
    "Greenbelt",
    "Halbert",
    "Hords Creek",
    "Houston",
    "Houston County",
    "Hubbard Creek",
    "Hubert H Moss",
    "Inks",
    "J B Thomas",
    "Jacksonville",
    "Jim Chapman",
    "Joe Pool",
    "Kemp",
    "Kickapoo",
    "Lake O The Pines",
    "Lavon",
    "Leon",
    "Lewisville",
    "Limestone",
    "Livingston",
    "Lost Creek",
    "Lyndon B Johnson",
    "Mackenzie",
    "Martin",
    "Medina",
    "Meredith",
    "Millers Creek",
    "Mineral Wells",
    "Monticello",
    "Mountain Creek",
    "Murvaul",
    "Nacogdoches",
    "Natural Dam",
    "Navarro Mills",
    "New Terrell City",
    "Nocona",
    "North Fork Buffalo Creek",
    "O C Fisher",
    "O H Ivie",
    "Oak Creek",
    "Palestine",
    "Palo Duro",
    "Palo Pinto",
    "Pat Cleburne",
    "Pat Mayse",
    "Possum Kingdom",
    "Proctor",
    "Ray Hubbard",
    "Ray Roberts",
    "Red Bluff",
    "Richland Chambers",
    "Sam Rayburn",
    "Somerville",
    "Squaw Creek",
    "Stamford",
    "Stillhouse Hollow",
    "Sulphur Springs",
    "Sweetwater",
    "Tawakoni",
    "Texana",
    "Texoma",
    "Toledo Bend",
    "Travis",
    "Twin Buttes",
    "Tyler",
    "Waco",
    "Waxahachie",
    "Weatherford",
    "White River",
    "Whitney",
    "Worth",
    "Wright Patman",
    "Big Sandy",
    "Blue Mesa",
    "Caballo",
    "Causey",
    "Crystal",
    "Currant Creek",
    "Deer Creek",
    "Echo",
    "Vallecito",
    "Moon Lake",
    "Lake Powell",
    "Flaming Gorge",
    "Rifle Gap",
    "Rockport",
    "Scofield",
    "Taylor Park",
    "Fontenelle",
    "Hyrum",
    "Jackson Gulch Reservoir",
    "Steinaker",
    "Santa Rosa",
    "Lemon",
    "Morrow Point",
    "Navajo",
    "Starvation",
    "Vega",
    "Upper Stillwater",
    "Strawberry",
    "Stateline",
    "Silver Jack",
    "Ridgway",
    "Red Fleet",
    "Pineview",
    "Paonia",
    "Newton",
    "Meeks Cabin",
    "McPhee",
    "Lost Creek Reservoir",
    "Lake Sumner",
    "Jordanelle",
    "Joes Valley",
    "Huntington North",
    "Elephant Butte",
    "Fruitgrowers",
    "East Canyon",
    "Lake Mohave",
    "Lake Havasu",
    "Lake Mead",
    "Agate",
    "American Falls",
    "Anderson Ranch",
    "Arrowrock",
    "Beulah",
    "Banks Lake",
    "Bully Creek",
    "Cold Springs",
    "Crane Prairie",
    "Crescent Lake",
    "Lake Cascade",
    "Deadwood",
    "Emigrant Lake",
    "Black Canyon",
    "Fish Lake",
    "Fourmile Lake",
    "Grand Coulee/FDR Lake",
    "Grassy Lake",
    "Haystack",
    "Howard Prairie Lake",
    "Hyatt",
    "Island Park",
    "Jackson Lake",
    "Lake Lowell",
    "Lucky Peak Lake",
    "Mann Creek",
    "McKay",
    "Milner",
    "Lake Walcott",
    "Ochoco",
    "Lake Owyhee",
    "Palisades",
    "Phillips Lake",
    "Prineville",
    "Reservoir A",
    "Ririe Lake",
    "Henry Hagg Lake",
    "Soldiers Meadow",
    "Thief Valley",
    "Unity",
    "Warm Springs Reservoir",
    "Clear Lake",
    "Wickiup",
    "Wildhorse",
    "Little Wood",
    "Horseshoe",
    "San Carlos",
    "C. C. Cragin",
    "Bartlett",
    "Lyman Lake",
    "Roosevelt",
    "Horse Mesa",
    "Mormon Flat",
    "Stewart Mtn",
    "Henrys Lake",
    "Dillon",
    "Williams Fork",
    "Antero",
    "Cheesman",
    "Eleven Mile",
    "Gross",
    "Marston",
    "Lake Coeur D'Alene",
    "Lake Pend Oreille",
    "Priest Lake",
    "Dworshak",
    "Magic",
    "Blackfoot",
    "Oakley",
    "Salmon Falls",
    "Brownlee",
    "Bear Lake",
    "Montpelier",
    "Conconully",
    "Lake Chelan",
    "Keechelus",
    "Kachess",
    "Cle Elum",
    "Bumping Lake",
    "Rimrock",
    "Ross",
    "Diablo",
    "Wallowa Lake",
    "Wolf Creek",
    "Willow Creek",
    "Clear Lake",
    "Blue River",
    "Cottage Grove",
    "Cougar",
    "Detroit",
    "Dorena",
    "Fall Creek",
    "Fern Ridge",
    "Applegate",
    "Lost Creek Res",
    "Cottonwood",
    "Abiquiu",
    "Bluewater Lake",
    "Brantley Lake",
    "Cochiti Lake",
    "Conchas Lake",
    "Costilla",
    "Eagle Nest Lake",
    "El Vado",
    "Heron",
    "Lake Avalon",
    "Lahontan",
    "Rye Patch",
    "Big Sand Wash",
    "Cleveland Lake",
    "Grantsville",
    "Gunlock",
    "Gunnison",
    "Ken's Lake",
    "Kolob",
    "Lower Enterprise",
    "Miller Flat",
    "Millsite",
    "Minersville",
    "Otter Creek",
    "Panguitch Lake",
    "Piute",
    "Porcupine",
    "Quail Creek",
    "Sand Hollow",
    "Sevier Bridge",
    "Smith And Morehouse",
    "Upper Enterprise",
    "Utah Lake",
    "Willard Bay",
    "Woodruff Creek",
    "Woodruff Narrows",
    "Bull Lake",
    "Boysen",
    "Pilot Butte",
    "Buffalo Bill",
    "Keyhole",
    "Seminoe",
    "Pathfinder",
    "Alcova",
    "Glendo",
    "Guernsey",
    "High Savery",
    "Viva Naughton",
    "Wheatland #2",
    "Adobe Creek",
    "Barr Lake",
    "Boyd Lake",
    "Carter Lake",
    "Clear Creek",
    "Cobb Lake",
    "Continental",
    "Crawford",
    "Cucharas",
    "Empire",
    "Fossil Creek",
    "Green Mtn",
    "Groundhog",
    "Homestake",
    "Horse Creek",
    "Horsecreek",
    "Horsetooth",
    "Jackson Gulch",
    "Jackson Lk",
    "John Martin",
    "Julesberg",
    "Lake Granby",
    "Lake Loveland",
    "Marshall",
    "Meredith Reservoir",
    "Milton",
    "Mountain Home",
    "Narraguinnep",
    "Platoro",
    "Point Of Rocks",
    "Prewitt",
    "Pueblo",
    "Ralph Price",
    "Rio Grande",
    "Riverside",
    "Ruedi",
    "Sanchez",
    "Santa Maria",
    "Shadow Mountain",
    "Spinney Mountain",
    "Stagecoach",
    "Standley",
    "Terrace",
    "Trinidad Lake",
    "Turquoise Lake",
    "Twin Lakes",
    "Union",
    "Windsor",
    "Wolford Mountain",
    "Ackley Lake",
    "Ashley Lake",
    "Bair",
    "Bighorn Lake",
    "Canyon Ferry Lake",
    "Clark Canyon",
    "Cooney",
    "Deadman's Basin",
    "East Fork Rock Creek",
    "Ennis Lake",
    "Fort Peck Lake",
    "Fresno",
    "Gibson",
    "Hauser Lake & Lake Helena",
    "Hebgen Lake",
    "Holter Lake",
    "Lake Elwell (Tiber)",
    "Lake Koocanusa",
    "Lake Sherburne",
    "Lima",
    "Lower Two Medicine Lake",
    "Martinsdale",
    "Middle Creek",
    "Nelson",
    "Nevada Creek",
    "Nilan",
    "Noxon Rapids",
    "Painted Rocks Lake",
    "Pishkun",
    "Ruby River",
    "Swift",
    "Thompson Falls",
    "Tongue River"
];

var base = '../data/stations';

fs.readdir(base, function(err, files) {
    files.forEach(function(file) {

        if(/csv$/.test(file)) {
            var data_file, base_data_file;

            if(/resv/.test(file)) {
                data_file = file.split('_')[0];
                if(file == 'texas_resv.csv') {
                    data_file = 'tx';
                }
            } else {
                data_file = file.split('.')[0]
            }

            if(data_file !== 'all') {
                base_data_file = data_file + '_all';
            } else {
                base_data_file = data_file;
            }

            var stations = d3.csvParse(fs.readFileSync(base + '/' + file, 'utf8').toString());
            var data = d3.csvParse(fs.readFileSync('../data/states_all/' + base_data_file + '.csv').toString());
            var data_load = d3.csvParse(fs.readFileSync('../data/states_all/' + data_file + '_load.csv').toString());
            var has_key = !!(file === 'all_resv.csv');
            var enhanced_stations = mapPctFull(data.concat(data_load), stations, reservoir_names, has_key);

            fs.writeFile(base + '_enhanced/' + file.split('.')[0] + '.json', JSON.stringify(enhanced_stations), function(err) {
                console.log(err)
            });
        }
    });
});

function mapPctFull(data, stations, reservoir_names, key_used) {
    var sorted = d3.nest()
        .key(function(d) {
            return (!key_used) ? d.reservoir : reservoir_names[d.reservoir];
        })
        .map(data);

    stations.forEach(function(d) {
        var res_total = _.last(sorted['$' + d.reservoir]);

        d.pct_capacity = (res_total !== undefined) ? res_total.pct_capacity : undefined;
        d.capacity = (res_total !== undefined) ? res_total.capacity : undefined;
        d.color = resColors(d.pct_capacity);
    });

    stations.sort(function(a,b) {
        var a_cap = +a.capacity;
        var b_cap = +b.capacity;
        if(b_cap < a_cap) {
            return -1;
        } else if(b_cap > a_cap) {
            return 1;
        } else {
            return 0;
        }
    });

    return stations;
}

function resColors(d) {
    if (d >= 75) {
        return '#1a9641';
    } else if (d >= 50) {
        return '#FCE883';
    } else if (d < 50) {
        return '#d7191c';
    } else {
        return 'lightgray';
    }
}