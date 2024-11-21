import sys
import pandas as pd 
from rdflib import Graph, Literal, RDF, URIRef, Namespace #basic RDF handling
from rdflib.namespace import FOAF , XSD #most common namespaces

def main():
  inputfile = sys.argv[1]
  outputfile = sys.argv[2]

  df = pd.read_csv(inputfile, sep=",")
  g = Graph()
  for index, row in df.iterrows():
    g.add((URIRef(row['s']), URIRef(row['p']), URIRef(row['o'])))
  g.serialize(outputfile, format='turtle')

if __name__ == '__main__':
  main()