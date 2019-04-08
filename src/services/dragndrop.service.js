//import recordStore from '../stores/record.store';
// import Muuri from 'muuri';
// require('hammerjs');

// class DragNDropService {
//   columnGrids = [];

//   init = async (onDragReleaseEnd) => {
//     var itemContainers = [].slice.call(
//       document.querySelectorAll(".board-column-content")
//     );

//     itemContainers.forEach((container) => {
//       // Instantiate column grid.
//       var grid = new Muuri(container, {
//         items: ".board-item",
//         layoutDuration: 400,
//         layoutEasing: "ease",
//         dragEnabled: true,
//         dragSort: function(item) {
//           return this.columnGrids;
//         }.bind(this),
//         dragSortInterval: 0,
//         dragSortPredicate: true,
//         dragContainer: document.getElementById('root'),
//         dragReleaseDuration: 400,
//         dragReleaseEasing: "ease"
//       })
//         .on("dragStart",(item) => {
//           item.getElement().style.width = item.getWidth() + "px";
//           item.getElement().style.height = item.getHeight() + "px";
//         })
//         .on("dragReleaseEnd", (item) => {
//           grid.synchronize();
//           grid.refreshSortData();

//           if(onDragReleaseEnd)
//             onDragReleaseEnd(grid, item);


//         });
//         if(! this.columnGrids.some(grd => grd.getElement().getAttribute("data-id")  === grid.getElement().getAttribute("data-id"))) {
//           this.columnGrids.push(grid);
//         } else {
//           grid.destroy(true);
//         }
//     });
//   }


// }



// export default new DragNDropService();