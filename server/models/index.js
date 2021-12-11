const mongoose  = require('mongoose');
const { Schema } = mongoose;

const nodeSchema = new Schema({
  id: String,
  user : { type: String, default: 'Guest' },
  title: String,
  body:   String,
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  votes: Number,
  childIds: Array,
  parentId: String,
  img: String
}, { collection: 'nodes' })

mongoose.connect('mongodb+srv://jvldwin:jvldwin@triplet.mvtfw.mongodb.net/triplet?retryWrites=true&w=majority')

const Node = mongoose.model('Node', nodeSchema)

const nodeList = async () => {
  const result = await Node.find().exec()
  return result;
}


function saveNode (value) {
  const {id, user, title, body, hidden, votes, childIds, parentId, img} = value 
  const newNode = new Node({
    id,
    user,
    title,
    body,
    hidden,
    votes,
    childIds,
    parentId,
    img
  })
  newNode.save()
  console.log('SAVE SUCCESS');
}

const updateNode =  async (value) => {
  const { id, user, title, body, img, childId } = value;
  console.log('user' + user)
  console.log('UPDATED SUCCESS')
}

const deleteNode = async (nodeDeleteValue) => {
  const {id} = nodeDeleteValue
    //delete id in parent
  await getAllDescendantIds(id)
}

async function getAllDescendantIds (nodeId) {
  console.log('PARENTID = '+nodeId)
  const existingNode = await Node.find({parentId: nodeId})
  console.log(existingNode)
  await Node.deleteOne({ id: nodeId})
  return existingNode.reduce((acc, node) => (
    [...acc, node.id, getAllDescendantIds(node.id)]
  ), [])
  //return [nodeId, ...getAllDescendantIds(existingNode.id)]
}


module.exports =  { saveNode, nodeList, updateNode, deleteNode }