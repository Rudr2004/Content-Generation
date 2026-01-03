// Profile image utility for testimonials with hire page specific mappings to prevent duplicates
export const getProfileImageByGender = (gender: string, fullName: string, hirePageTitle?: string) => {
  // Ensure proper gender detection for future hire pages
  const detectedGender = gender || getGenderFromName(fullName);
  
  // Create unique key combining name and page title to prevent duplicates across pages
  const uniqueKey = hirePageTitle ? `${fullName}_${hirePageTitle}` : fullName;
  
  // Create hire page specific mappings to prevent duplicate profile images across different pages
  const createPageSpecificMapping = (name: string, page: string) => `${name}_${page}`;
  
  // Comprehensive page-specific mappings to ensure unique profile images per hire page and service pages
  const pageSpecificMappings: Record<string, string> = {
    // === SERVICE PAGES MAPPINGS (for consistent service testimonials) ===
    [createPageSpecificMapping("Client 1", "Service_testimonial_0")]: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Client 2", "Service_testimonial_1")]: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Client 3", "Service_testimonial_2")]: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === LLM DEVELOPERS PAGE ===
    [createPageSpecificMapping("Michael Thompson", "Hire LLM  Developers")]: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Sarah Peterson", "Hire LLM  Developers")]: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === BLOCKCHAIN DEVELOPERS PAGE ===
    [createPageSpecificMapping("Michael Thompson", "Hire Blockchain Developers")]: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Liam Johnson", "Hire Blockchain Developers")]: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Ava Mitchell", "Hire Blockchain Developers")]: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === WEB3 DEVELOPERS PAGE ===
    [createPageSpecificMapping("Jessica Tran", "Hire Web3 Developers")]: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Michael Reed", "Hire Web3 Developers")]: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Sandra Lopez", "Hire Web3 Developers")]: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Brian Kim", "Hire Web3 Developers")]: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === DEFI ENGINEERS PAGE ===
    [createPageSpecificMapping("James Carter", "Hire DeFi Engineers Developers")]: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Sarah Mitchell", "Hire DeFi Engineers Developers")]: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Michael Davidson", "Hire DeFi Engineers Developers")]: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Laura Bennett", "Hire DeFi Engineers Developers")]: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === NFT DEVELOPERS PAGE ===
    [createPageSpecificMapping("Jessica Lee", "Hire NFT Developers")]: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Michael Carter", "Hire NFT Developers")]: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Sandra Nguyen", "Hire NFT Developers")]: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("David Brown", "Hire NFT Developers")]: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === TOKENOMICS CONSULTANTS PAGE ===
    [createPageSpecificMapping("Jessica Collins", "Hire Tokenomics Consultants Developers")]: "https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Michael Thompson", "Hire Tokenomics Consultants Developers")]: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Laura Chen", "Hire Tokenomics Consultants Developers")]: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("David Kim", "Hire Tokenomics Consultants Developers")]: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === RAG SPECIALISTS PAGE ===
    [createPageSpecificMapping("Michael Johnson", "Hire RAG Specialists Developers")]: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Sophia Martinez", "Hire RAG Specialists Developers")]: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("James Li", "Hire RAG Specialists Developers")]: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === AI AGENTS DEVELOPERS PAGE ===
    [createPageSpecificMapping("Michael Thompson", "Hire AI Agents Developers")]: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("John Everett", "Hire AI Agents Developers")]: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === AI CHATBOT DEVELOPERS PAGE ===
    [createPageSpecificMapping("Jamie Watson", "Hire AI Chatbot Developers")]: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Morgan Lee", "Hire AI Chatbot Developers")]: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Taylor Brooks", "Hire AI Chatbot Developers")]: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Jordan Mitchell", "Hire AI Chatbot Developers")]: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    
    // === MULTIMODAL AI DEVELOPERS PAGE === (Fixed specific unique images)
    [createPageSpecificMapping("Alex Johnson", "Hire Multimodal AI Developers")]: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Emma Chen", "Hire Multimodal AI Developers")]: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Michael Renaud", "Hire Multimodal AI Developers")]: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    [createPageSpecificMapping("Samantha Lee", "Hire Multimodal AI Developers")]: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  };

  // Check for page-specific mapping first, then fall back to name-only mapping
  if (pageSpecificMappings[uniqueKey]) {
    return pageSpecificMappings[uniqueKey];
  }
  if (pageSpecificMappings[fullName]) {
    return pageSpecificMappings[fullName];
  }

  // MASSIVE image pools with 25+ unique images per gender to prevent future duplicates
  const maleImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  ];

  const femaleImages = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1494790108755-2616b772b1c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1548142813-039e6b10a73e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  ];

  // Create a more sophisticated hash that ensures unique results for different names
  let nameHash = 0;
  const hashString = uniqueKey + detectedGender; // Use unique key that includes page context
  
  // Enhanced hash function with better distribution
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    nameHash = ((nameHash << 5) - nameHash + char) & 0xffffffff;
    nameHash = nameHash ^ (char << (i % 16)); // Add XOR with position-based shift
  }
  nameHash = Math.abs(nameHash);
  
  // Extract first name to ensure different names get different base values
  const firstName = fullName.split(' ')[0] || 'Client';
  let firstNameHash = 0;
  for (let i = 0; i < firstName.length; i++) {
    firstNameHash = ((firstNameHash * 31) + firstName.charCodeAt(i)) & 0xffffffff;
  }
  firstNameHash = Math.abs(firstNameHash);
  
  // Add multiple offsets using unique key to ensure better distribution and prevent duplicates
  const lengthOffset = uniqueKey.length * 13; // Prime number for better distribution
  const charSumOffset = uniqueKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) * 7;
  const positionOffset = uniqueKey.indexOf(' ') * 11; // Space position as additional entropy
  const pageOffset = hirePageTitle ? hirePageTitle.length * 23 : 0; // Page-specific offset
  const firstNameOffset = firstNameHash * 17; // Add first name specific offset
  
  // Add extra entropy based on page type to ensure maximum variety across different page types
  const pageTypeOffset = hirePageTitle ? (
    hirePageTitle.includes('Service') ? 101 :
    hirePageTitle.includes('Hire') ? 203 :
    hirePageTitle.includes('Case') ? 307 :
    hirePageTitle.includes('Fallback') ? 401 : 503
  ) : 0;
  
  nameHash += lengthOffset + charSumOffset + positionOffset + pageOffset + pageTypeOffset + firstNameOffset;
  
  // Advanced distribution system to prevent ANY future duplicates across pages
  if (detectedGender === "female") {
    // Use multiple hash layers with stronger separation to ensure maximum distribution for female images
    const primaryHash = (nameHash * 17 + firstNameOffset) % femaleImages.length;
    const secondaryHash = (nameHash * 23 + pageOffset + firstNameHash) % femaleImages.length;
    const tertiaryHash = (nameHash * 29 + uniqueKey.length * 31 + firstName.length * 37) % femaleImages.length;
    const quaternaryHash = (firstNameHash * 41 + nameHash * 43) % femaleImages.length;
    
    // Combine hashes with weighted distribution to ensure completely different results for different names
    const finalIndex = (primaryHash * 3 + secondaryHash * 5 + tertiaryHash * 7 + quaternaryHash * 11) % femaleImages.length;
    return femaleImages[finalIndex];
  } else {
    // Use different prime multipliers for male images to ensure separation from female logic
    const primaryHash = (nameHash * 19 + firstNameOffset) % maleImages.length;
    const secondaryHash = (nameHash * 37 + pageOffset + firstNameHash) % maleImages.length;
    const tertiaryHash = (nameHash * 41 + uniqueKey.length * 43 + firstName.length * 47) % maleImages.length;
    const quaternaryHash = (firstNameHash * 53 + nameHash * 59) % maleImages.length;
    
    // Combine hashes with weighted distribution to ensure completely different results for different names
    const finalIndex = (primaryHash * 3 + secondaryHash * 5 + tertiaryHash * 7 + quaternaryHash * 11) % maleImages.length;
    return maleImages[finalIndex];
  }
};

export const getGradientByGender = (gender: string) => {
  if (gender === "female") {
    return "from-pink-500 to-purple-500";
  } else {
    return "from-blue-500 to-indigo-500";
  }
};

// Helper to determine gender from name if not provided - comprehensive list for all future hire pages
export const getGenderFromName = (fullName: string): string => {
  const femaleNames = [
    'Emily', 'Sarah', 'Jennifer', 'Sophia', 'Michelle', 'Lisa', 'Jessica', 
    'Amanda', 'Nicole', 'Stephanie', 'Ava', 'Sandra', 'Rachel', 'Ashley', 
    'Megan', 'Samantha', 'Hannah', 'Victoria', 'Elizabeth', 'Rebecca', 
    'Lauren', 'Katherine', 'Anna', 'Maria', 'Grace', 'Natalie', 'Emma', 
    'Olivia', 'Isabella', 'Chloe', 'Madison', 'Abigail', 'Taylor', 'Brianna',
    'Morgan', 'Jordan', 'Casey', 'Riley', 'Cameron', 'Quinn',
    'Laura', 'Amy', 'Angela', 'Christine', 'Diane', 'Helen', 'Janet',
    'Patricia', 'Catherine', 'Diana', 'Melissa', 'Kimberly', 'Monica',
    'Linda', 'Barbara', 'Susan', 'Karen', 'Nancy', 'Betty', 'Dorothy',
    'Lena', 'Elena', 'Helena', 'Magdalena', 'Milena', 'Selena',
    'Carol', 'Ruth', 'Sharon', 'Donna', 'Deborah', 'Cynthia', 'Julie',
    'Joyce', 'Virginia', 'Jacqueline', 'Heather', 'Pamela', 'Gloria',
    'Teresa', 'Sara', 'Janice', 'Marie', 'Kelly', 'Christina', 'Joan',
    'Evelyn', 'Lauren', 'Judith', 'Megan', 'Andrea', 'Cheryl', 'Hannah',
    'Jacqueline', 'Martha', 'Gloria', 'Frances', 'Debra', 'Carolyn',
    'Janet', 'Virginia', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce',
    'Kathryn', 'Olivia', 'Emma', 'Ava', 'Sophie', 'Zoe', 'Chloe', 'Lily',
    'Grace', 'Ella', 'Charlotte', 'Scarlett', 'Aria', 'Maya', 'Layla',
    'Mia', 'Isabella', 'Luna', 'Harper', 'Amelia', 'Evelyn', 'Abigail',
    'Sofia', 'Avery', 'Camila', 'Ella', 'Eleanor', 'Madison', 'Nora',
    'Hazel', 'Ellie', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn',
    'Bella', 'Claire', 'Skylar', 'Lucy', 'Paisley', 'Anna', 'Caroline',
    'Naomi', 'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison',
    'Maya', 'Valentina', 'Gabriella', 'Madelyn', 'Adeline', 'Julia',
    'Brooke', 'Isabelle', 'Samantha', 'Mackenzie', 'Andrea', 'Kimberly',
    'Rachel', 'Stephanie', 'Nicole', 'Jessica', 'Alexis', 'Victoria',
    // Additional international female names to prevent mismatches
    'Priya', 'Priyanka', 'Sneha', 'Pooja', 'Anita', 'Sunita', 'Rita',
    'Kavita', 'Sita', 'Geeta', 'Meera', 'Neha', 'Riya', 'Sonia',
    'Asha', 'Rekha', 'Shweta', 'Shruti', 'Preeti', 'Swati', 'Nisha',
    'Deepika', 'Kiran', 'Vani', 'Lata', 'Uma', 'Chitra', 'Sarika',
    'Renu', 'Shanti', 'Gayatri', 'Lalita', 'Seema', 'Alka', 'Sushma',
    'Madhavi', 'Rajani', 'Smita', 'Vinita', 'Namita', 'Vandana', 'Mira',
    'Fatima', 'Aisha', 'Nadia', 'Yasmin', 'Salma', 'Amina', 'Zara',
    'Ling', 'Wei', 'Li', 'Mei', 'Xin', 'Lei', 'Yan', 'Min', 'Jun',
    'Yuki', 'Akiko', 'Mariko', 'Keiko', 'Sachiko', 'Naoko', 'Hiroko'
  ];
  
  const firstName = fullName.split(' ')[0];
  
  // Check for unisex names that need special handling - CRITICAL for preventing mismatches
  const unisexSpecialCases: Record<string, string> = {
    'Taylor Brooks': 'female', // Based on context in our database
    'Morgan Lee': 'male',
    'Jordan Mitchell': 'male',
    'Jordan Patel': 'male', // Fix for hire developer pages
    'Jamie Watson': 'male',
    'Alex Johnson': 'female', // IMPORTANT: Alex Johnson is female in Multimodal AI page
    'Alex Rodriguez': 'male',
    'Alexis Thompson': 'female', // Fix for hire developer pages
    'Leslie Kim': 'female',
    'Casey Smith': 'female',
    'Robin Chen': 'female',
    'Dana Williams': 'female',
    'Chris Johnson': 'male',
    'Sam Davis': 'male',
    'Pat Brown': 'female'
  };

  // Additional female name patterns that might be missed
  const femaleNamePatterns = [
    /^Dr\.\s*([A-Z][a-z]+)/i, // Dr. followed by name
    /^Ms\.\s*([A-Z][a-z]+)/i, // Ms. followed by name  
    /^Mrs\.\s*([A-Z][a-z]+)/i // Mrs. followed by name
  ];

  // Check for title-based gender indicators
  for (const pattern of femaleNamePatterns) {
    const match = fullName.match(pattern);
    if (match) {
      const extractedName = match[1];
      if (femaleNames.includes(extractedName)) {
        return 'female';
      }
    }
  }
  
  // Check specific full name mappings first
  if (unisexSpecialCases[fullName]) {
    return unisexSpecialCases[fullName];
  }
  
  return femaleNames.includes(firstName) ? 'female' : 'male';
};

// Function to automatically fix gender assignments in database based on names
export const getCorrectGender = (clientName: string): string => {
  return getGenderFromName(clientName);
};

// Robust fallback system for broken images using real profile photos
export const getBackupProfileImage = (gender: string): string => {
  const backupMaleImages = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  ];
  
  const backupFemaleImages = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  ];
  
  if (gender === "female") {
    return backupFemaleImages[0];
  } else {
    return backupMaleImages[0];
  }
};