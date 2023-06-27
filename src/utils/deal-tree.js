
export function dealTree(tree, otherDeal) {
  if (tree) {
    tree.forEach(item => {
      item.label = item.name
      if (typeof otherDeal === 'function') {
        otherDeal(item)
      }
      if (item.children && item.children.length) {
        dealTree(item.children)
      } else {
        delete item.children
      }
    })
  }
}

