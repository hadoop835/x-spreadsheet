// docs
import '../../core/_.prototypes';

/** default page list
 * @type {page[]}
 */
const PAGE = [
  { key: '10', title: '每页10条' },
  { key: '30', title: '每页30条' },
  { key: '50', title: '每页50条' },
];
 
const PRINT = [
    { key: 'html', title: 'html打印' },
    { key: 'canvas', title: 'canvas打印' }, 
  ];

  const EXPORT = [
    { key: 'excel', title: 'excel' },
    { key: 'pdf', title: 'PDF' }, 
    { key: 'image', title: '图片' },
  ];
export default {};
export { 
  PAGE, 
  PRINT,
  EXPORT,
};
