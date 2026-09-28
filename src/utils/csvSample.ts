/**
 * Returns sample CSV content in the exact Google Form format provided by the user
 */
export function getSampleCSVContent(): string {
  const headers = [
    'Timestamp',
    'Email address',
    'Team Leader name',
    'Team Leader Email',
    'Team Name',
    'Team Leader Sem',
    'Team Leader Phone number',
    'Team leader Enrollement',
    'Team member 1 name',
    'Enrollement Team member 1',
    'Team member 1 phone number',
    'Team member 1 gmail id',
    'Team member 2 name',
    'Enrollement Team member 2',
    'Team member 2  phone number',
    'Team member 2 gmail',
    'Team member 3 name',
    'Enrollement Team member 3',
    'Team member 3 phone number',
    'Team member 3 gmail',
    'Team member 4',
    'Enrollement Team member 4',
    'Team member 4 phone number',
    'Team member 4 gmail',
    'Team member 5',
    'Enrollement Team member 5',
    'Team member 5 phone number',
    'Team member 5 gmail',
    'Upload your SIH 2026 PPT in pdf format ( carefully note : only 6 slide are allowed)',
    'Mention you SIH2026 Problem statement theme',
    'Mention you SIH2026 Problem statement ID (PS ID)'
  ].join('\t');

  const row1 = [
    '2026-09-27 10:15:00',
    'cyberhexofficial@gmail.com',
    'Aarav Sharma',
    'aarav.sharma@titbhopal.ac.in',
    'CyberHex Titans',
    '7th',
    '+91 98260 12345',
    '0191CS221001',
    'Priya Verma',
    '0191CS221045',
    '+91 98260 12346',
    'priya.verma@gmail.com',
    'Rohan Gupta',
    '0191IT221012',
    '+91 98260 12347',
    'rohan.gupta@gmail.com',
    'Sneha Patel',
    '0191EC221034',
    '+91 98260 12348',
    'sneha.patel@gmail.com',
    'Aditya Joshi',
    '0191CS221089',
    '+91 98260 12349',
    'aditya.joshi@gmail.com',
    'Ananya Mishra',
    '0191CS221015',
    '+91 98260 12350',
    'ananya.mishra@gmail.com',
    'https://drive.google.com/file/d/1TIT_SIH_Presentation_CyberHex/preview',
    'AI & Robotics',
    'SIH1601'
  ].join('\t');

  return `${headers}\n${row1}`;
}
