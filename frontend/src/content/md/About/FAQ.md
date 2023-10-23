# Kann ich Text XY bitte als E-Text bekommen? 
Na sicher! Unter "Werke" in der Werkansicht kann man die Texte entweder einzelnen oder als Paket als \*.txt herunterladen. 

# Wie zitiere ich die MHDBDB? 
**Mittelhochdeutsche Begriffsdatenbank (MHDBDB).** Universität Salzburg. Koordination: Katharina Zeppezauer-Wachauer. Seit 1992. URL: [http://www.mhdbdb.plus.ac.at/](http://www.mhdbdb.plus.ac.at/) (Abrufdatum). Eine DOI ist für 2024 geplant.
# Kann ich meine Suchabfragen speichern?
Ein personalisierter User-Bereich ist für 2024 geplant. Es ist aber jetzt schon möglich, den Suchverlauf für eine Session einzusehen. 

# Welche Metadaten sind verfügbar?

Für bibliografische Metadaten nutzt die MHDBDB BIBFRAME 2.0 (RDF), für weitere Metadatenobjekte (Personen, Orte, Ereignisse) CIDOC-CRM (RDF). Sämtliche Metadaten der MHDBDB sind ans Semantic Web bzw. an Normdaten angebunden und als Linked-Open-Data (LOD) verfügbar gemacht. 

# Warum sind die Editionen so alt?
Das hat urheberrechtliche Gründe. Aber in Zeiten von Digitalen Editionen ist uns daran gelegen, neue Open Access-Editionen zu implementieren, sofern diese im TEI-Format vorliegen. Man möge sich bitte mit uns in Verbindung setzen. 

# Warum dauert die Suche so lange? 

Die MHDBDB baut im Hintergrund auf RDF (Graphdaten) auf und ist ein riesiges Daten-Schlachtschiff. Zum Vergleich: Konventionelle DH-Projekte haben im Schnitt hunderttausende bis maximal einige Millionen [Triples, (https://www.digitale-edition.at/o:konde.167)] also Graph-Statements, im einstelligen Bereich. Größere (z.B. Europeana) haben 300 – 500 Millionen. Die MHDBDB hat aufgrund ihres Umfangs 6 Milliarden Triples! 

Datenverarbeitung braucht viel mehr Power als die reine Datenablage. Die Anzahl der Triples hängt von verschiedenen Faktoren ab.

- Datenumfang: Je mehr Datenquellen und Informationen in das Projekt einbezogen werden, desto mehr Triples werden erstellt. 
- Komplexität der Modelle: Wenn das RDF-Modell komplex ist und viele Beziehungen zwischen Entitäten darstellt, führt dies zu einer höheren Anzahl von Triples. 
   
Die MHDBDB ist seit über 50 Jahren im Einsatz und weist 10 Millionen Tokens auf. Jedes dieser Tokens verweisen 10-20 unterschiedliche Annotationen (vgl. [[Daten]]) und diese wiederum stehen in zahlreichen komplexen Relationen zueinander. 
Die Anfragen können derzeit teilweise bis zu 40 Sekunden dauern. Perfekt, um sich einen Kaffee zu holen! 

# Geht das in Zukunft auch schneller? 

Wir arbeiten kontinuierlich an der Optimierung unserer Suchmöglichkeiten. Graphdaten stoßen allerdings bei so komplexen Modellen und vielen Daten irgendwann an ihre Grenzen. Die MHDBDB nutzt GraphDB, einen etablierten RDF-Triplestore, der für die Speicherung und Abfrage von großen semantischen Graphen optimiert ist. Dennoch reicht es nicht für eine vollkommen zufriedenstellende Performanz. 

Letztlich sind wir auf Entscheidungen und Entwicklungen der Universität Salzburg angewiesen, da derzeit kein uns bekannter Triplestore/kein Repositorium in- oder auch außerhalb von Universitäten die großen Mengen der MHDBDB problemlos bewältigen kann. Wir arbeiten auch im Verbund mit anderen Partnern an einer besseren Infrastrukturlösung im leistungsstarken High Performance Computing (HPC)-Bereich für österreichische Digital Humanities-Projekte [siehe [www.dhinfra.at](http://www.dhinfra.at)]. 

Bis es einen solchen „Supercomputer“ für DH-Projekte gibt, bitten wir weiterhin um Geduld.

# Warum soll ich die neue Plattform nutzen, obwohl sie noch nicht perfekt funktioniert? 

Es gibt eine große Menge neuer Features, Vorteile und Verbesserungen gegenüber der alten Website, beispielsweise den Download von Volltexten und Annotationen, eine visuelle Suchmaske für einfache Einzelwort-Suchen, die Anbindung ans Semantic Web uvm. Für mehr Details siehe „About > Niuwe maere“.

