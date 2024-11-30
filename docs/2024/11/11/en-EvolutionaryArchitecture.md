# Evolutionary Architecture

Architecture is the set of principles that you would like to have gotten right from the start, so that they wouldn't have to change later. Only, in practice, everything changes continually. There­fore, it is necessary to evaluate regularly whether the archi­tecture still fits the purpose of the system.

The architecture of a system is the set of principles that were actually used during the design and development of the system. Every system has an architecture. If the approach was: "we build a prototype, we deploy it to production and after that we'll see how we deal with the obstacles that we encounter", then that is the architecture.

As a system inevitably accumulates complexity, it becomes harder and harder to see and take into account all aspects of its architecture. Hence, the practice in many organisations to deal with different aspects of architecture from many different roles: enterprise architect, domain architect, solution architect, infra­structure architect, etc.

Often (almost everywhere), the assumption is that the archi­tecture is fixed. Consequently, it is assumed that the architect only has to design changes to the system according to the existing principles. However, it is unavoidable that, every now and then, it is necessary deviate a little bit from these principles and slowly but surely the system degrades into the proverbial big ball of mud. Therefore, it is imperative that at least one of the architects monitors the flexibility of the architecture. In larger enterprises it is even advisable to employ an evolutionary architect in addition to the specialised architects, with the specific task to ensure flexibility.

However large or small the mismatch between the architecture of the system and the purpose of that system becomes, it always pays off to look at:

* The principles
* Ways to make the actual architecture explicit
* Ways to measure the mismatch between the actual architecture and the desired architecture

In this ongoing process we should keep searching for corrections that have the most expected gain. In this search we constantly seek a balance between stability on one hand and the flexibility needed to be able to adapt the system to changed requirements on the other. So, to complement to agile software development, we also need [Agile Architecture](#!en@post@2024/11/11/en-AgileArchitecture.md).