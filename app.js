// E-FDT Platform - Main JavaScript
// =====================================

// GEMINI API CONFIGURATION
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual API key
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5:generateContent";

// Indian Cities Data
const INDIA_CITIES = {
  Mumbai: { lat: 19.076, lon: 72.8777, population: 20411000 },
  Delhi: { lat: 28.6139, lon: 77.209, population: 30291000 },
  Bangalore: { lat: 12.9716, lon: 77.5946, population: 12326000 },
  Hyderabad: { lat: 17.385, lon: 78.4867, population: 10004000 },
  Chennai: { lat: 13.0827, lon: 80.2707, population: 10971000 },
  Kolkata: { lat: 22.5726, lon: 88.3639, population: 14850000 },
  Pune: { lat: 18.5204, lon: 73.8567, population: 6430000 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714, population: 8059000 },
  Jaipur: { lat: 26.9124, lon: 75.7873, population: 3046000 },
  Surat: { lat: 21.1702, lon: 72.8311, population: 6081000 },
  Lucknow: { lat: 26.8467, lon: 80.9462, population: 3382000 },
  Kanpur: { lat: 26.4499, lon: 80.3319, population: 2920000 },
  Nagpur: { lat: 21.1458, lon: 79.0882, population: 2497000 },
  Indore: { lat: 22.7196, lon: 75.8577, population: 2201000 },
  Thane: { lat: 19.2183, lon: 72.9781, population: 1841000 },
  Bhopal: { lat: 23.2599, lon: 77.4126, population: 1883000 },
  Visakhapatnam: { lat: 17.6868, lon: 83.2185, population: 2035000 },
  Patna: { lat: 25.5941, lon: 85.1376, population: 2049000 },
  Vadodara: { lat: 22.3072, lon: 73.1812, population: 1817000 },
  Ghaziabad: { lat: 28.6692, lon: 77.4538, population: 1729000 },
};

const CLIMATE_SCENARIOS = {
  Baseline: { temp: 0, sea_level: 0, flood_mult: 1.0 },
  "IPCC 1.5°C": { temp: 1.5, sea_level: 0.3, flood_mult: 1.2 },
  "IPCC 2°C": { temp: 2.0, sea_level: 0.5, flood_mult: 1.5 },
  "IPCC 3°C": { temp: 3.0, sea_level: 1.0, flood_mult: 2.0 },
  "4°C+": { temp: 4.0, sea_level: 1.5, flood_mult: 2.5 },
};

// Global State
let analysisData = null;
let blockchain = [];
let map = null;

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  updateThresholdDisplay();
});

// Event Listeners
function initializeEventListeners() {
  // Threshold slider
  document
    .getElementById("greenThreshold")
    .addEventListener("input", updateThresholdDisplay);

  // Run Analysis button
  document
    .getElementById("runAnalysisBtn")
    .addEventListener("click", runAnalysis);

  // Tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  // Download buttons
  document.getElementById("downloadCSV").addEventListener("click", downloadCSV);
  document
    .getElementById("downloadJSON")
    .addEventListener("click", downloadJSON);
  document.getElementById("downloadPDF").addEventListener("click", downloadPDF);
}

// Update threshold display
function updateThresholdDisplay() {
  const value = document.getElementById("greenThreshold").value;
  document.getElementById("thresholdValue").textContent = value;
}

// Switch tabs
function switchTab(tabName) {
  // Update button states
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.closest(".tab-btn").classList.add("active");

  // Update tab panes
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });
  document.getElementById(tabName + "Tab").classList.add("active");
}

// Main Analysis Function
async function runAnalysis() {
  const city = document.getElementById("citySelect").value;

  if (!city) {
    alert("Please select a city first!");
    return;
  }

  // Hide welcome, show results
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("resultsScreen").style.display = "block";
  document.getElementById("loadingSpinner").style.display = "block";

  // Add to blockchain
  addToBlockchain("Analysis Started", {
    city: city,
    timestamp: new Date().toISOString(),
  });

  // Simulate analysis
  setTimeout(async () => {
    const data = generateAnalysisData(city);
    analysisData = data;

    // Add to blockchain
    addToBlockchain("Top Sites Identified", {
      sites: data.sites.slice(0, 5).map((s) => s.site_id),
      avg_score: (
        data.sites
          .slice(0, 5)
          .reduce((sum, s) => sum + s.suitability_score, 0) / 5
      ).toFixed(2),
    });

    addToBlockchain("Carbon Credits Verified", {
      credits: data.carbon.verified_credits,
      value_range: `₹${(data.carbon.min_value * 83).toLocaleString()}-₹${(
        data.carbon.max_value * 83
      ).toLocaleString()}`,
    });

    addToBlockchain("Compliance Check", {
      framework: data.compliance.framework,
      grade: data.compliance.grade,
      rate: `${Math.round(data.compliance.rate)}%`,
    });

    addToBlockchain("Climate Resilience Tested", {
      scenario: data.climate.scenario,
      viability: `${data.climate.avg_viability}%`,
      recommendation: data.climate.recommendation,
    });

    // Get AI insights
    await getGeminiInsights(data);

    displayResults(data);
  }, 3000);
}

// Get AI Insights from Gemini
async function getGeminiInsights(data) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.log("Gemini API key not configured. Skipping AI insights.");
    return null;
  }

  try {
    const prompt = `Analyze this sustainable urban development project for ${
      data.city
    }:
        
Top 5 Sites: ${data.sites
      .slice(0, 5)
      .map((s) => s.site_id)
      .join(", ")}
Average Suitability Score: ${(
      data.sites.slice(0, 5).reduce((sum, s) => sum + s.suitability_score, 0) /
      5
    ).toFixed(2)}
Carbon Credits: ${data.carbon.verified_credits} tons
Compliance Grade: ${data.compliance.grade} (${Math.round(
      data.compliance.rate
    )}%)
Climate Viability: ${data.climate.avg_viability}%
ROI: ${data.financial.roi}%
Jobs Created: ${data.sites
      .slice(0, 5)
      .reduce((sum, s) => sum + s.job_creation_potential, 0)}

Provide 3 key insights and 2 recommendations in a concise format (max 150 words).`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const insights = result.candidates[0].content.parts[0].text;

      addToBlockchain("AI Insights Generated", {
        provider: "Gemini",
        insights: insights.substring(0, 200) + "...",
      });

      return insights;
    }
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return null;
  }
}

// Generate Analysis Data
function generateAnalysisData(city) {
  const cityInfo = INDIA_CITIES[city];
  const greenThreshold = parseInt(
    document.getElementById("greenThreshold").value
  );
  const projectType = document.getElementById("projectType").value;
  const complianceFramework = document.getElementById(
    "complianceFramework"
  ).value;
  const climateScenario = document.getElementById("climateScenario").value;

  // Generate sites
  const sites = generateSites(city, cityInfo, greenThreshold);

  // Calculate metrics
  const carbon = calculateCarbonCredits(sites);
  const compliance = checkCompliance(sites, complianceFramework);
  const climate = testClimateScenario(sites, climateScenario);
  const financial = calculateFinancial(carbon);
  const sdg = calculateSDGAlignment(sites);
  const engagement = sites.slice(0, 5).map((site) => calculateEngagement(site));

  return {
    city,
    cityInfo,
    greenThreshold,
    projectType,
    sites,
    carbon,
    compliance,
    climate,
    financial,
    sdg,
    engagement,
  };
}

// Generate Sites Data
function generateSites(city, cityInfo, greenThreshold) {
  const sites = [];
  const rng = seededRandom(hashCode(city));

  for (let i = 0; i < 15; i++) {
    const latOffset = (rng() - 0.5) * 0.1;
    const lonOffset = (rng() - 0.5) * 0.16;
    const incomeLevel = ["Low", "Medium", "High"][
      Math.floor(rng() * 10) < 4 ? 0 : Math.floor(rng() * 10) < 8 ? 1 : 2
    ];

    const site = {
      site_id: `${city.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(
        3,
        "0"
      )}`,
      name: `${city} Site ${i + 1}`,
      lat: cityInfo.lat + latOffset,
      lon: cityInfo.lon + lonOffset,
      population: Math.floor(5000 + rng() * 45000),
      income_level: incomeLevel,
      housing_demand: Math.floor(100 + rng() * 900),
      walk_time_to_park: Math.floor(5 + rng() * 30),
      brownfield_available: rng() > 0.4,
      flood_risk: 0.05 + rng() * 0.3,
      air_quality_index: Math.floor(30 + rng() * 120),
      tree_coverage: 10 + rng() * 35,
      biodiversity_score: 3 + rng() * 6,
      carbon_reduction_potential: Math.floor(1000 + rng() * 4000),
      job_creation_potential: Math.floor(50 + rng() * 450),
      supply_chain_risk: 0.1 + rng() * 0.3,
      gentrification_risk: 0.05 + rng() * 0.3,
    };

    // Calculate suitability score
    const isGreenGap = site.walk_time_to_park > greenThreshold ? 5 : 0;
    const equityMult =
      incomeLevel === "Low" ? 6 : incomeLevel === "Medium" ? 2 : 0;
    const poorAir = site.air_quality_index > 100 ? 0.3 : 0;

    const impactScore =
      isGreenGap +
      site.housing_demand * 0.5 +
      site.walk_time_to_park * 0.1 +
      equityMult +
      poorAir +
      (1 - site.supply_chain_risk) * 2 +
      site.job_creation_potential * 0.01;

    const riskScore =
      site.flood_risk * 100 +
      (site.brownfield_available ? 0 : 5) +
      site.gentrification_risk * 50 +
      site.supply_chain_risk * 30;

    site.suitability_score = impactScore - riskScore;

    sites.push(site);
  }

  return sites.sort((a, b) => b.suitability_score - a.suitability_score);
}

// Calculate Carbon Credits
function calculateCarbonCredits(sites) {
  const topSites = sites.slice(0, 5);
  const totalCO2 = topSites.reduce(
    (sum, s) => sum + s.carbon_reduction_potential,
    0
  );
  const verifiedCredits = Math.round(totalCO2 * 0.95 * 0.9 * 0.85);

  return {
    total_co2: totalCO2,
    verified_credits: verifiedCredits,
    min_value: Math.round(verifiedCredits * 15),
    max_value: Math.round(verifiedCredits * 30),
    efficiency: 0.95,
    permanence: 0.9,
    additionality: 0.85,
  };
}

// Check Compliance
function checkCompliance(sites, framework) {
  const topSites = sites.slice(0, 5);
  const avgCarbon =
    topSites.reduce((sum, s) => sum + s.carbon_reduction_potential, 0) / 5;
  const avgBio = topSites.reduce((sum, s) => sum + s.biodiversity_score, 0) / 5;
  const brownfieldCount = topSites.filter((s) => s.brownfield_available).length;
  const avgFlood = topSites.reduce((sum, s) => sum + s.flood_risk, 0) / 5;
  const avgTree = topSites.reduce((sum, s) => sum + s.tree_coverage, 0) / 5;
  const avgAQI = topSites.reduce((sum, s) => sum + s.air_quality_index, 0) / 5;
  const avgWalk = topSites.reduce((sum, s) => sum + s.walk_time_to_park, 0) / 5;
  const totalJobs = topSites.reduce(
    (sum, s) => sum + s.job_creation_potential,
    0
  );
  const avgSupply =
    topSites.reduce((sum, s) => sum + s.supply_chain_risk, 0) / 5;

  const criteria = {
    "Indian Green Building": {
      "Carbon Reduction >20%": avgCarbon > 1000,
      "Biodiversity Protection": avgBio > 5,
      "Brownfield Priority": brownfieldCount >= 3,
      "Flood Risk <0.3": avgFlood < 0.3,
    },
    "LEED India": {
      "Energy Savings >30%": avgCarbon > 1500,
      "Green Space >20%": avgTree > 20,
      "Air Quality Good": avgAQI < 100,
      "Public Transport <15min": avgWalk < 15,
    },
    "India Net Zero 2070": {
      "Emissions Reduction >25%": avgCarbon > 1200,
      "Green Jobs Created": totalJobs > 500,
      "Supply Chain Resilient": avgSupply < 0.25,
      "Public Health Improved": avgAQI < 110,
    },
  };

  const results = criteria[framework];
  const passCount = Object.values(results).filter((v) => v).length;
  const rate = (passCount / Object.keys(results).length) * 100;
  const grade = rate >= 85 ? "A" : rate >= 70 ? "B" : "C";

  return { framework, results, rate, grade };
}

// Test Climate Scenario
function testClimateScenario(sites, scenarioName) {
  const scenario = CLIMATE_SCENARIOS[scenarioName];
  const topSites = sites.slice(0, 5);

  const viabilityScores = topSites.map((site) => {
    const adjustedFlood = site.flood_risk * scenario.flood_mult;
    const heatImpact = scenario.temp * 5;
    return Math.max(0, 100 - adjustedFlood * 100 - heatImpact);
  });

  const avgViability =
    viabilityScores.reduce((sum, v) => sum + v, 0) / viabilityScores.length;
  const recommendation =
    avgViability >= 90
      ? "PROCEED"
      : avgViability >= 70
      ? "ADAPT DESIGN"
      : "RECONSIDER";

  return {
    scenario: scenarioName,
    viability_scores: viabilityScores,
    avg_viability: Math.round(avgViability * 10) / 10,
    recommendation,
    temp_rise: scenario.temp,
    sea_level_rise: scenario.sea_level,
  };
}

// Calculate Financial Analysis
function calculateFinancial(carbon) {
  const initialCost = 10000000; // 10 Crore
  const greenGrants = 2500000; // 2.5 Crore
  const netCost = initialCost - greenGrants;
  const annualBenefits = 2000000; // 20 Lakh
  const carbonRevenue = Math.round(
    ((carbon.min_value + carbon.max_value) / 2) * 83
  );
  const totalAnnual = annualBenefits + carbonRevenue;
  const roi =
    Math.round(((totalAnnual * 5 - netCost) / netCost) * 100 * 10) / 10;
  const paybackPeriod = Math.round((netCost / totalAnnual) * 10) / 10;

  return {
    initial_cost: initialCost,
    green_grants: greenGrants,
    net_cost: netCost,
    annual_benefits: annualBenefits,
    carbon_revenue: carbonRevenue,
    total_annual: totalAnnual,
    roi,
    payback_period: paybackPeriod,
  };
}

// Calculate SDG Alignment
function calculateSDGAlignment(sites) {
  const topSites = sites.slice(0, 5);

  return {
    "SDG 3: Good Health":
      Math.round(
        (topSites.reduce(
          (sum, s) => sum + Math.max(0, 100 - s.air_quality_index / 1.5),
          0
        ) /
          5) *
          10
      ) / 10,
    "SDG 7: Clean Energy":
      Math.round(
        Math.min(
          100,
          topSites.reduce((sum, s) => sum + s.carbon_reduction_potential, 0) /
            5 /
            30
        ) * 10
      ) / 10,
    "SDG 8: Decent Work":
      Math.round(
        Math.min(
          100,
          topSites.reduce((sum, s) => sum + s.job_creation_potential, 0) / 5 / 2
        ) * 10
      ) / 10,
    "SDG 11: Sustainable Cities":
      Math.round(
        (topSites.reduce(
          (sum, s) => sum + Math.max(0, 100 - s.walk_time_to_park * 3),
          0
        ) /
          5) *
          10
      ) / 10,
    "SDG 13: Climate Action":
      Math.round(
        Math.min(
          100,
          topSites.reduce((sum, s) => sum + s.carbon_reduction_potential, 0) /
            5 /
            25
        ) * 10
      ) / 10,
    "SDG 15: Life on Land":
      Math.round(
        (topSites.reduce((sum, s) => sum + s.biodiversity_score * 10, 0) / 5) *
          10
      ) / 10,
  };
}

// Calculate Engagement Score
function calculateEngagement(site) {
  const accessibility = Math.max(0, 100 - (site.walk_time_to_park / 30) * 100);
  const healthBenefit = Math.max(0, 100 - site.air_quality_index / 1.5);
  const transparency = (1 - site.gentrification_risk) * 100;
  const localJobs = Math.min(100, site.job_creation_potential / 2);
  const overall =
    (accessibility + healthBenefit + transparency + localJobs) / 4;

  return {
    site_id: site.site_id,
    accessibility: Math.round(accessibility * 10) / 10,
    health_benefit: Math.round(healthBenefit * 10) / 10,
    transparency: Math.round(transparency * 10) / 10,
    local_jobs: Math.round(localJobs * 10) / 10,
    overall: Math.round(overall * 10) / 10,
  };
}

// Utility Functions
function seededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

// Blockchain Functions
function addToBlockchain(action, data) {
  const timestamp = new Date().toISOString();
  const prevHash =
    blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : "0";

  const entry = {
    index: blockchain.length + 1,
    timestamp,
    action,
    data,
    prev_hash: prevHash,
  };

  entry.hash = createHash(JSON.stringify(entry));
  blockchain.push(entry);
}

function createHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// Display Results Function
function displayResults(data) {
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("kpiSection").style.display = "block";
  document.getElementById("tabsSection").style.display = "block";
  document.getElementById("downloadSection").style.display = "block";

  // Update KPIs
  document.getElementById(
    "carbonCredits"
  ).textContent = `${data.carbon.verified_credits.toLocaleString()} tons`;
  document.getElementById("carbonDelta").textContent = `${formatCurrency(
    data.carbon.min_value * 83
  )}-${formatCurrency(data.carbon.max_value * 83)}/year`;
  document.getElementById("complianceGrade").textContent =
    data.compliance.grade;
  document.getElementById("complianceDelta").textContent = `${Math.round(
    data.compliance.rate
  )}% compliant`;
  document.getElementById(
    "climateViability"
  ).textContent = `${data.climate.avg_viability}%`;
  document.getElementById("climateDelta").textContent =
    data.climate.recommendation;
  document.getElementById("roiValue").textContent = `${data.financial.roi}%`;
  document.getElementById(
    "roiDelta"
  ).textContent = `${data.financial.payback_period} years payback`;
  document.getElementById("jobsCreated").textContent = data.sites
    .slice(0, 5)
    .reduce((sum, s) => sum + s.job_creation_potential, 0)
    .toLocaleString();

  // Initialize map
  initializeMap(data);

  // Populate tabs
  populateCarbonTab(data);
  populateComplianceTab(data);
  populateImpactTab(data);
  populateSitesTab(data);
  populateBlockchainTab();
}

// Initialize Map
function initializeMap(data) {
  if (map) {
    map.remove();
  }

  const mapDiv = document.getElementById("map");
  map = L.map(mapDiv).setView([data.cityInfo.lat, data.cityInfo.lon], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  data.sites.forEach((site, index) => {
    const rank = index + 1;
    let color = "green";
    let size = 8;

    if (rank <= 5) {
      color = "gold";
      size = 15;
    } else if (site.walk_time_to_park > data.greenThreshold) {
      color = "red";
    }

    const marker = L.circleMarker([site.lat, site.lon], {
      radius: size,
      fillColor: color,
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    const popupContent = `
            <strong>${site.site_id}</strong><br>
            Rank: ${rank}<br>
            Suitability: ${site.suitability_score.toFixed(1)}<br>
            Income: ${site.income_level}<br>
            Walk Time: ${site.walk_time_to_park} min<br>
            CO₂ Reduction: ${site.carbon_reduction_potential} tons<br>
            Jobs: ${site.job_creation_potential}
        `;

    marker.bindPopup(popupContent);
  });
}

// Populate Carbon Tab
function populateCarbonTab(data) {
  // Verification table
  document.getElementById("verificationTable").innerHTML = `
        <tr><td>Efficiency</td><td>${data.carbon.efficiency}</td><td>95%</td></tr>
        <tr><td>Permanence</td><td>${data.carbon.permanence}</td><td>90%</td></tr>
        <tr><td>Additionality</td><td>${data.carbon.additionality}</td><td>85%</td></tr>
    `;

  // Carbon summary
  document.getElementById("totalCO2").textContent =
    data.carbon.total_co2.toLocaleString();
  document.getElementById("verifiedCredits").textContent =
    data.carbon.verified_credits.toLocaleString();
  document.getElementById("marketValue").textContent = `${formatCurrency(
    data.carbon.min_value * 83
  )} - ${formatCurrency(data.carbon.max_value * 83)}/year`;

  // Financial data
  document.getElementById("initialCost").textContent = formatCurrency(
    data.financial.initial_cost
  );
  document.getElementById("greenGrants").textContent = formatCurrency(
    data.financial.green_grants
  );
  document.getElementById("netCost").textContent = formatCurrency(
    data.financial.net_cost
  );
  document.getElementById("annualBenefits").textContent = formatCurrency(
    data.financial.annual_benefits
  );
  document.getElementById("carbonRevenue").textContent = formatCurrency(
    data.financial.carbon_revenue
  );
  document.getElementById("totalAnnual").textContent = formatCurrency(
    data.financial.total_annual
  );
  document.getElementById("roiPercent").textContent = `${data.financial.roi}%`;
  document.getElementById(
    "paybackPeriod"
  ).textContent = `${data.financial.payback_period} years`;
  document.getElementById("fiveYearNet").textContent = formatCurrency(
    data.financial.total_annual * 5 - data.financial.net_cost
  );

  // CO2 Chart
  const co2Ctx = document.getElementById("co2Chart").getContext("2d");
  new Chart(co2Ctx, {
    type: "bar",
    data: {
      labels: data.sites.slice(0, 5).map((s) => s.site_id),
      datasets: [
        {
          label: "CO₂ Reduction (tons/year)",
          data: data.sites.slice(0, 5).map((s) => s.carbon_reduction_potential),
          backgroundColor: "#10b981",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}

// Populate Compliance Tab
function populateComplianceTab(data) {
  // Compliance details
  document.getElementById("complianceFrameworkTitle").textContent =
    data.compliance.framework;
  document.getElementById("complianceRate").textContent = `${Math.round(
    data.compliance.rate
  )}%`;
  document.getElementById("complianceGradeDetail").textContent =
    data.compliance.grade;

  // Compliance table
  let complianceHTML = "";
  for (const [criterion, passed] of Object.entries(data.compliance.results)) {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    const statusClass = passed ? "text-success" : "text-danger";
    complianceHTML += `<tr><td>${criterion}</td><td class="${statusClass}">${status}</td></tr>`;
  }
  document.getElementById("complianceTable").querySelector("tbody").innerHTML =
    complianceHTML;

  // Compliance Chart
  const complianceCtx = document
    .getElementById("complianceChart")
    .getContext("2d");
  const passCount = Object.values(data.compliance.results).filter(
    (v) => v
  ).length;
  const failCount = Object.values(data.compliance.results).length - passCount;

  new Chart(complianceCtx, {
    type: "doughnut",
    data: {
      labels: ["Passed", "Failed"],
      datasets: [
        {
          data: [passCount, failCount],
          backgroundColor: ["#10b981", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Climate scenario details
  document.getElementById("climateScenarioTitle").textContent =
    data.climate.scenario;
  document.getElementById(
    "tempRise"
  ).textContent = `+${data.climate.temp_rise}°C`;
  document.getElementById(
    "seaLevelRise"
  ).textContent = `+${data.climate.sea_level_rise}m`;
  document.getElementById(
    "avgViability"
  ).textContent = `${data.climate.avg_viability}%`;
  document.getElementById("recommendation").textContent =
    data.climate.recommendation;

  // Viability alert
  const alertDiv = document.getElementById("viabilityAlert");
  if (data.climate.avg_viability >= 90) {
    alertDiv.className = "alert success";
    alertDiv.textContent =
      "✅ Excellent viability - Projects are highly resilient to this climate scenario";
  } else if (data.climate.avg_viability >= 70) {
    alertDiv.className = "alert warning";
    alertDiv.textContent =
      "⚠️ Moderate viability - Consider adaptive design measures";
  } else {
    alertDiv.className = "alert error";
    alertDiv.textContent =
      "❌ Low viability - Significant redesign or site reconsideration recommended";
  }

  // Climate Chart
  const climateCtx = document.getElementById("climateChart").getContext("2d");
  new Chart(climateCtx, {
    type: "bar",
    data: {
      labels: data.sites.slice(0, 5).map((s) => s.site_id),
      datasets: [
        {
          label: "Viability Score (%)",
          data: data.climate.viability_scores,
          backgroundColor: data.climate.viability_scores.map((v) =>
            v >= 90 ? "#10b981" : v >= 70 ? "#f59e0b" : "#ef4444"
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

// Populate Impact Tab
function populateImpactTab(data) {
  // SDG Chart
  const sdgCtx = document.getElementById("sdgChart").getContext("2d");
  const sdgLabels = Object.keys(data.sdg);
  const sdgValues = Object.values(data.sdg);

  new Chart(sdgCtx, {
    type: "radar",
    data: {
      labels: sdgLabels,
      datasets: [
        {
          label: "SDG Alignment Score",
          data: sdgValues,
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgb(99, 102, 241)",
          pointBackgroundColor: "rgb(99, 102, 241)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(99, 102, 241)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  const avgSDG = Math.round(
    sdgValues.reduce((sum, v) => sum + v, 0) / sdgValues.length
  );
  document.getElementById("avgSDG").textContent = `${avgSDG}%`;

  // Jobs Chart
  const jobsCtx = document.getElementById("jobsChart").getContext("2d");
  new Chart(jobsCtx, {
    type: "bar",
    data: {
      labels: data.sites.slice(0, 5).map((s) => s.site_id),
      datasets: [
        {
          label: "Jobs Created",
          data: data.sites.slice(0, 5).map((s) => s.job_creation_potential),
          backgroundColor: "#8b5cf6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });

  const totalJobs = data.sites
    .slice(0, 5)
    .reduce((sum, s) => sum + s.job_creation_potential, 0);
  document.getElementById("totalJobs").textContent = totalJobs.toLocaleString();

  // Engagement Table
  let engagementHTML = "";
  data.engagement.forEach((e) => {
    engagementHTML += `
            <tr>
                <td><strong>${e.site_id}</strong></td>
                <td>${e.accessibility}%</td>
                <td>${e.health_benefit}%</td>
                <td>${e.transparency}%</td>
                <td>${e.local_jobs}%</td>
                <td><strong>${e.overall}%</strong></td>
            </tr>
        `;
  });
  document.getElementById("engagementTable").querySelector("tbody").innerHTML =
    engagementHTML;

  // Environmental Justice metrics
  const topSites = data.sites.slice(0, 5);
  const lowIncomeCount = topSites.filter(
    (s) => s.income_level === "Low"
  ).length;
  const avgGentrif =
    topSites.reduce((sum, s) => sum + s.gentrification_risk, 0) / 5;
  const greenGaps = topSites.filter(
    (s) => s.walk_time_to_park > data.greenThreshold
  ).length;
  const residentsServed = topSites.reduce((sum, s) => sum + s.population, 0);

  document.getElementById("lowIncomeCount").textContent = `${lowIncomeCount}/5`;
  document.getElementById("lowIncomeDelta").textContent = `${(
    (lowIncomeCount / 5) *
    100
  ).toFixed(0)}% of top sites`;

  document.getElementById("gentrifRisk").textContent = avgGentrif.toFixed(2);
  document.getElementById("gentrifStatus").textContent =
    avgGentrif < 0.2
      ? "Low Risk ✅"
      : avgGentrif < 0.3
      ? "Medium Risk ⚠️"
      : "High Risk ❌";

  document.getElementById("greenGapsSolved").textContent = `${greenGaps}/5`;
  document.getElementById(
    "residentsServed"
  ).textContent = `Serving ${residentsServed.toLocaleString()} residents`;
}

// Populate Sites Tab
function populateSitesTab(data) {
  const accordion = document.getElementById("sitesAccordion");
  let html = "";

  data.sites.slice(0, 5).forEach((site, index) => {
    html += `
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <span><strong>#${index + 1} ${site.site_id}</strong> - ${
      site.name
    } (Score: ${site.suitability_score.toFixed(1)})</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="accordion-body" id="accordion-${index}">
                    <div class="site-details-grid">
                        <div class="site-detail-section">
                            <h4>📍 Location</h4>
                            <p><strong>Coordinates:</strong> ${site.lat.toFixed(
                              4
                            )}, ${site.lon.toFixed(4)}</p>
                            <p><strong>Population:</strong> ${site.population.toLocaleString()}</p>
                            <p><strong>Income Level:</strong> ${
                              site.income_level
                            }</p>
                        </div>
                        <div class="site-detail-section">
                            <h4>🏘️ Housing & Access</h4>
                            <p><strong>Housing Demand:</strong> ${
                              site.housing_demand
                            } units</p>
                            <p><strong>Walk to Park:</strong> ${
                              site.walk_time_to_park
                            } min</p>
                            <p><strong>Brownfield:</strong> ${
                              site.brownfield_available ? "Yes ✅" : "No ❌"
                            }</p>
                        </div>
                        <div class="site-detail-section">
                            <h4>🌍 Environment</h4>
                            <p><strong>Flood Risk:</strong> ${(
                              site.flood_risk * 100
                            ).toFixed(1)}%</p>
                            <p><strong>Air Quality Index:</strong> ${
                              site.air_quality_index
                            }</p>
                            <p><strong>Tree Coverage:</strong> ${site.tree_coverage.toFixed(
                              1
                            )}%</p>
                            <p><strong>Biodiversity:</strong> ${site.biodiversity_score.toFixed(
                              1
                            )}/10</p>
                        </div>
                        <div class="site-detail-section">
                            <h4>💼 Impact</h4>
                            <p><strong>CO₂ Reduction:</strong> ${
                              site.carbon_reduction_potential
                            } tons/yr</p>
                            <p><strong>Jobs Created:</strong> ${
                              site.job_creation_potential
                            }</p>
                            <p><strong>Supply Risk:</strong> ${(
                              site.supply_chain_risk * 100
                            ).toFixed(1)}%</p>
                            <p><strong>Gentrification Risk:</strong> ${(
                              site.gentrification_risk * 100
                            ).toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  accordion.innerHTML = html;
}

// Toggle Accordion
function toggleAccordion(index) {
  const body = document.getElementById(`accordion-${index}`);
  const header = body.previousElementSibling;

  // Close all other accordions
  document.querySelectorAll(".accordion-body").forEach((b, i) => {
    if (i !== index) {
      b.classList.remove("active");
      b.previousElementSibling.classList.remove("active");
    }
  });

  // Toggle current accordion
  body.classList.toggle("active");
  header.classList.toggle("active");
}

// Populate Blockchain Tab
function populateBlockchainTab() {
  const container = document.getElementById("blockchainEntries");
  let html = "";

  blockchain.forEach((entry) => {
    html += `
            <div class="blockchain-entry">
                <h4>🔗 Block #${entry.index} - ${entry.action}</h4>
                <p><strong>Timestamp:</strong> ${new Date(
                  entry.timestamp
                ).toLocaleString()}</p>
                <p><strong>Data:</strong> ${JSON.stringify(
                  entry.data,
                  null,
                  2
                )}</p>
                <p><strong>Previous Hash:</strong> ${entry.prev_hash}</p>
                <code>Hash: ${entry.hash}</code>
            </div>
        `;
  });

  container.innerHTML = html;
}

// Download Functions
function downloadCSV() {
  if (!analysisData) return;

  let csv =
    "Site ID,Name,Income Level,Suitability Score,CO2 Reduction,Jobs Created,Flood Risk,Gentrification Risk\n";
  analysisData.sites.forEach((site) => {
    csv += `${site.site_id},${site.name},${
      site.income_level
    },${site.suitability_score.toFixed(2)},${site.carbon_reduction_potential},${
      site.job_creation_potential
    },${site.flood_risk.toFixed(2)},${site.gentrification_risk.toFixed(2)}\n`;
  });

  downloadFile(csv, `${analysisData.city}_analysis.csv`, "text/csv");
}

function downloadJSON() {
  if (!blockchain.length) return;

  const json = JSON.stringify(blockchain, null, 2);
  downloadFile(
    json,
    `${analysisData.city}_blockchain.json`,
    "application/json"
  );
}

function downloadPDF() {
  alert(
    "PDF download feature coming soon! For now, please use Print to PDF from your browser."
  );
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

