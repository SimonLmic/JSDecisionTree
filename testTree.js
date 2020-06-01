/*
a simple decision tree
*/

const dataTable = [
    { 'view-upper-left' : true, 'view-upper-right' : true  , 'view-lower-left' : true  , 'view-lower-right' : true , 'engagement-time': 30, 'click': true, 'conversion': true },
    { 'view-upper-left' : true, 'view-upper-right' : true  , 'view-lower-left' : true  , 'view-lower-right' : false , 'engagement-time': 5, 'click': true, 'conversion': false },
    { 'view-upper-left' : true, 'view-upper-right' : true  , 'view-lower-left' : false  , 'view-lower-right' : true , 'engagement-time': 10, 'click': true, 'conversion': false },
    { 'view-upper-left' : true, 'view-upper-right' : false  , 'view-lower-left' : false  , 'view-lower-right' : true , 'engagement-time': 3, 'click': true, 'conversion': false },
    { 'view-upper-left' : false, 'view-upper-right' : true  , 'view-lower-left' : true  , 'view-lower-right' : true , 'engagement-time': 15, 'click': true, 'conversion': false },
    { 'view-upper-left' : false, 'view-upper-right' : false  , 'view-lower-left' : false  , 'view-lower-right' : false , 'engagement-time': 15, 'click': false, 'conversion': false },
    { 'view-upper-left' : true, 'view-upper-right' : false  , 'view-lower-left' : false  , 'view-lower-right' : false , 'engagement-time': 15, 'click': false, 'conversion': false },
    { 'view-upper-left' : false, 'view-upper-right' : true  , 'view-lower-left' : false  , 'view-lower-right' : false , 'engagement-time': 15, 'click': false, 'conversion': false },
    { 'view-upper-left' : false, 'view-upper-right' : false  , 'view-lower-left' : true  , 'view-lower-right' : true , 'engagement-time': 15, 'click': false, 'conversion': false },
]

const features = Object.keys( dataTable[0] )
const featureList = features.slice(0, 5)


class Node {
    constructor(feature, index, featureList, left = null, right = null, featureQuestion = null) {
        this.feature = feature
        this.index = index
        this.featureList = featureList
        this.left = left
        this.right = right
    }
}


class FeatureQuestion {
    constructor(questionId, featureName = null, questionText = null, questionValue = null) {
        this.questionId = questionId
        this.featureName = featureName // id
        this.questionText = questionText
        this.questionValue = questionValue
    }
}


class BST {

    constructor(dataTable){
        this.root = null
    }

    add ( ) {
        const node = this.root
        if (node === null) {
            let sampleIndex = [...dataTable.keys()];
            let feature = this.bestFeature(sampleIndex, featureList)
            let updatedFeatureList = featureList.filter( (element) => element !== feature[0] )
            this.root = new Node( feature, sampleIndex, updatedFeatureList)
            console.log(this.root)
            console.log("end of node.\n\n\n")
            return
        } else {
            const searchTree = function(node) {

                let leftSampleIndex = []
                let rightSampleIndex = []
                node.index.forEach( sampleIdx => {
                    if ( dataTable[sampleIdx][node.feature[0]] === true ) {
                        leftSampleIndex.push(sampleIdx)
                    } else if ( dataTable[sampleIdx][node.feature[0]] === false ) {
                        rightSampleIndex.push(sampleIdx)
                    }
                });

                if ( node.left === null ) {
                    let feature = this.bestFeature( node.index, node.featureList )
                    //console.log(feature)
                    if ( feature[1] <= node.feature[1] && leftSampleIndex.length !== 0 ) {
                        let updatedFeatureList = node.featureList.filter( (element) => element !== node.feature[0] )
                        //console.log(node.feature[0], leftSampleIndex)
                        //console.log(updatedFeatureList)
                        node.left = new Node( feature, leftSampleIndex, updatedFeatureList)
                        console.log("node - ", node)
                        console.log("end of node.\n\n\n")
                    }
                } else if ( node.left !== null ) {
                    return searchTree(node.left)
                }

                if ( node.right === null ) {
                    let feature = this.bestFeature( node.index, node.featureList )
                    //console.log(feature)
                    if ( feature[1] <= node.feature[1] && rightSampleIndex.length !== 0 ) {
                        let updatedFeatureList = node.featureList.filter( (element) => element !== node.feature[0] )
                        //console.log(node.feature[0], rightSampleIndex)
                        //console.log(updatedFeatureList)
                        node.right = new Node( feature, rightSampleIndex, updatedFeatureList)
                        console.log("node - ", node)
                        console.log("end of node.\n\n\n")
                    }
                } else if ( node.right !== null ) {
                    return searchTree(node.right)
                }

            }.bind(this)
            return searchTree(node)
        }
    }

    bestFeature ( sampleIndex, featureList ) {

        var giniRank = []

        featureList.forEach( feature => {
            
            let leftTargetTrue = 0
            let leftTargetFalse = 0
            let rightTargetTrue = 0
            let rightTargetFalse = 0
            let targetClass = "click"
            
            
            sampleIndex.forEach( sample  => {
                if ( dataTable[sample][feature] === true ) {
                    if ( dataTable[sample][targetClass] === true ) {
                        leftTargetTrue++
                    } else {
                        leftTargetFalse++
                    }
                } else if ( dataTable[sample][feature] === false ) {
                    if ( dataTable[sample][targetClass] === true ) {
                        rightTargetTrue++
                    } else {
                        rightTargetFalse++
                    }
                }
            });

            //console.log(feature, leftTargetTrue,leftTargetFalse,rightTargetTrue, rightTargetFalse)

            if (feature !== 'engagement-time' ) { // todo loop over target class for left/right node
                let gleftTargetTrue = leftTargetTrue/(leftTargetTrue+leftTargetFalse)
                if (isNaN(gleftTargetTrue)) { gleftTargetTrue = 0 }
                let gleftTargetFalse = leftTargetFalse/(leftTargetTrue+leftTargetFalse)
                if (isNaN(gleftTargetFalse)) { gleftTargetFalse = 0 }
                let ginileft = 1 - Math.pow( gleftTargetTrue , 2) - Math.pow( gleftTargetFalse , 2)

                let gRightTargetTrue = rightTargetTrue/(rightTargetTrue+rightTargetFalse)
                if (isNaN(gRightTargetTrue)) { gRightTargetTrue = 0 }
                let gRightTargetFalse = rightTargetFalse/(rightTargetTrue+rightTargetFalse)
                if (isNaN(gRightTargetFalse)) { gRightTargetFalse = 0 }
                let giniRight = 1 - Math.pow( gRightTargetTrue , 2) - Math.pow( gRightTargetFalse , 2)

                let gini = (leftTargetTrue + leftTargetFalse) /  (leftTargetTrue + leftTargetFalse + rightTargetTrue + rightTargetFalse) * ginileft + 
                ( rightTargetTrue + rightTargetFalse ) /  (leftTargetTrue + leftTargetFalse + rightTargetTrue + rightTargetFalse) * giniRight

                giniRank[feature] = gini
            }

        });

        giniRank = Object.keys(giniRank).map(function(key) {
            return [key, giniRank[key]];
        })
        giniRank.sort(function(first, second) {
            return second[1] - first[1]
        });

        giniRank.reverse()
        
        return giniRank.shift()
    }


    predictSampleTargetValue ( sample ) {
        let current = this.root;
        while( current ) {
            if ( current.left === null && current.right === null ) {
                
                let leftSampleIndex = []
                let rightSampleIndex = []
                current.index.forEach( sampleIdx => {
                    if ( dataTable[sampleIdx][current.feature[0]] === true ) {
                        leftSampleIndex.push(sampleIdx)
                    } else if ( dataTable[sampleIdx][current.feature[0]] === false ) {
                        rightSampleIndex.push(sampleIdx)
                    }
                });

                if ( leftSampleIndex.length > rightSampleIndex.length ) {
                    console.log("predicted value is true")
                } else {
                    console.log("predicted value is false")
                }
                return true;
            }
            if ( sample[current.feature[0]] === true ) {
                current = current.left;
            } else if ( sample[current.feature[0]] === false ) {
                current = current.right;
            }
        }
        return false;
    }

}


const bst = new BST()

bst.add( )
bst.add( )
bst.add( )
bst.add( )
bst.add( )

bst.predictSampleTargetValue({ 'view-upper-left' : false, 'view-upper-right' : true  , 'view-lower-left' : false  , 'view-lower-right' : false , 'engagement-time': 15, 'click': false, 'conversion': false })

