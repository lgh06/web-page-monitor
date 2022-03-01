
const fs = require('fs-extra')

function main(){
  try {
    fs.copySync('.next2', '.next')
    console.log('copy .next2 to .next success!')
  } catch (err) {
    console.error(err)
  }
}

main()
