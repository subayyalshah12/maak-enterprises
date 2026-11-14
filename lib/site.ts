export const company = {
  name: 'MAAK Enterprises Company',
  tagline: 'BUILD • DEVELOP • GROW',
  email: 'maakentps@gmail.com',
  leadership: [
    { title: 'CEO', name: 'Uzair Ali Kazmi', phone: '0331-5342214' },
    { title: 'COO', name: 'Umair Ali Kazmi', phone: '0310-5271306' },
    { title: 'Project Director', name: 'Shahzaib Anjum', phone: '0318-9862182' },
  ],
  offices: [
    { title: 'Gulberg Greens Office', address: 'Gulberg Greens, Islamabad, Pakistan', divisions: 'Real Estate & Educational Consultancy', maps: 'https://maps.app.goo.gl/vQ4ZNE7yYTCaDeCCA' },
    { title: 'Rawalpindi Office', address: 'Rawalpindi, Pakistan', divisions: 'Construction operations', maps: 'https://maps.app.goo.gl/4yYzaY975fBm4WS76' },
  ],
  divisions: [
    { title: 'Real Estate', href: '/real-estate', number: '01', copy: 'Property opportunities and enquiries, presented with clarity.' },
    { title: 'Construction', href: '/construction', number: '02', copy: 'Construction operations based in Rawalpindi.' },
    { title: 'Educational Consultancy', href: '/education', number: '03', copy: 'Education consultancy enquiries from our Gulberg Greens office.' },
  ],
};
export const formatPrice = (value: number | null, currency = 'PKR') => value == null ? 'Price on request' : `${currency} ${new Intl.NumberFormat('en-PK').format(value)}`;
